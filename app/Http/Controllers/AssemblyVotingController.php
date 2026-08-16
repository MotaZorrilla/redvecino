<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssemblyVotingRequest;
use App\Http\Requests\CastUnitVoteRequest;
use App\Models\AssemblyUnitVote;
use App\Models\AssemblyVoting;
use App\Models\AssemblyVotingOption;
use App\Models\Property;
use App\Services\UnitCoefficientResolver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AssemblyVotingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $condoId = $request->query('condominium_id');

        $votings = AssemblyVoting::with(['options.votes', 'votes.property'])
            ->when($condoId, fn ($q) => $q->where('condominium_id', $condoId))
            ->latest()
            ->get();

        return response()->json($votings);
    }

    public function show(int $id): JsonResponse
    {
        $voting = AssemblyVoting::with(['options.votes', 'votes.property', 'condominium'])->findOrFail($id);

        $totalUnits = Property::where('condominium_id', $voting->condominium_id)->count();
        $votedUnitsCount = $voting->votes->count();
        $totalVotedCoefficient = $voting->votes->sum('coefficient_weight');

        $participatingPercent = $totalUnits > 0 ? ($votedUnitsCount / $totalUnits) * 100 : 0;
        $hasLegalQuorum = $participatingPercent >= $voting->quorum_required_percent;

        $optionsTally = $voting->options->map(function ($option) use ($totalVotedCoefficient) {
            $optionVotesCount = $option->votes->count();
            $optionCoefficient = $option->votes->sum('coefficient_weight');
            $weightedPercent = $totalVotedCoefficient > 0 ? ($optionCoefficient / $totalVotedCoefficient) * 100 : 0;

            return [
                'id' => $option->id,
                'title' => $option->title,
                'description' => $option->description,
                'votes_count' => $optionVotesCount,
                'coefficient_sum' => round($optionCoefficient, 4),
                'weighted_percentage' => round($weightedPercent, 2),
            ];
        });

        return response()->json([
            'voting' => $voting,
            'summary' => [
                'total_condo_units' => $totalUnits,
                'voted_units_count' => $votedUnitsCount,
                'participating_percentage' => round($participatingPercent, 2),
                'total_voted_coefficient' => round($totalVotedCoefficient, 4),
                'quorum_required' => $voting->quorum_required_percent,
                'has_legal_quorum' => $hasLegalQuorum,
                'options_tally' => $optionsTally,
            ],
        ]);
    }

    public function store(AssemblyVotingRequest $request): JsonResponse
    {
        $data = $request->validated();

        $voting = DB::transaction(function () use ($data, $request) {
            $v = AssemblyVoting::create([
                'condominium_id' => $data['condominium_id'],
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'quorum_required_percent' => $data['quorum_required_percent'] ?? 50.0,
                'status' => 'open',
                'created_by' => $request->user()?->id,
                'starts_at' => now(),
            ]);

            foreach ($data['options'] as $opt) {
                AssemblyVotingOption::create([
                    'assembly_voting_id' => $v->id,
                    'title' => $opt['title'],
                    'description' => $opt['description'] ?? null,
                ]);
            }

            return $v;
        });

        return response()->json($voting->load('options'), 201);
    }

    public function castVote(CastUnitVoteRequest $request, int $id): JsonResponse
    {
        $voting = AssemblyVoting::findOrFail($id);

        if ($voting->status !== 'open') {
            return response()->json(['message' => 'Esta votación se encuentra cerrada.'], 422);
        }

        $data = $request->validated();
        $property = Property::findOrFail($data['property_id']);

        // Verificar si la unidad ya votó
        $alreadyVoted = AssemblyUnitVote::where('assembly_voting_id', $voting->id)
            ->where('property_id', $property->id)
            ->exists();

        if ($alreadyVoted) {
            return response()->json([
                'message' => 'Esta unidad ya emitió su voto en esta asamblea conforme al Art. 15 de la Ley 21.442.',
            ], 422);
        }

        $coefficient = UnitCoefficientResolver::resolve($property);

        $vote = AssemblyUnitVote::create([
            'assembly_voting_id' => $voting->id,
            'property_id' => $property->id,
            'user_id' => $request->user()->id,
            'assembly_voting_option_id' => $data['assembly_voting_option_id'],
            'coefficient_weight' => $coefficient,
        ]);

        return response()->json($vote->load(['property', 'option']), 201);
    }

    public function close(int $id): JsonResponse
    {
        $voting = AssemblyVoting::findOrFail($id);
        $voting->update([
            'status' => 'closed',
            'ends_at' => now(),
        ]);

        return response()->json(['message' => 'Votación cerrada y acta final consolidada.', 'voting' => $voting]);
    }
}
