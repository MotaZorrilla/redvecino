<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\TicketAttachment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TicketAttachmentFactory extends Factory
{
    protected $model = TicketAttachment::class;

    public function definition(): array
    {
        return [
            'ticket_id' => Ticket::factory(),
            'file_path' => 'uploads/tickets/' . fake()->uuid() . '.pdf',
            'file_name' => fake()->word() . '.pdf',
            'file_size' => fake()->numberBetween(1000, 5000000),
            'uploaded_by' => User::factory(),
        ];
    }
}
