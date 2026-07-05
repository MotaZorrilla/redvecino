<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialCatalog extends Model
{
    protected $table = 'financial_catalog';

    protected $fillable = [
        'type',
        'category_key',
        'label',
        'subcategories',
    ];

    protected $casts = [
        'subcategories' => 'array',
    ];
}
