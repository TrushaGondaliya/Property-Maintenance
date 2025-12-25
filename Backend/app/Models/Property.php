<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use HasFactory, SoftDeletes;

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    protected static function booted()
    {
        static::deleting(function ($property) {
            if ($property->isForceDeleting()) {
                $property->workOrders()->forceDelete();
            } else {
                $property->workOrders()->delete();
            }
        });
    }

    public function workOrders()
    {
        return $this->hasMany(WorkOrder::class, 'property_id');
    }
}
