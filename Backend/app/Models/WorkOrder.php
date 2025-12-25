<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkOrder extends Model
{
     use HasFactory, SoftDeletes;

     public function property()
     {
          return $this->belongsTo(Property::class, 'property_id');
     }
     public function user()
     {
          return $this->belongsTo(User::class, 'created_by');
     }

     public function getStatusTextAttribute()
     {
          return match ($this->status) {
               'pending'     => 'Pending',
               'in_progress' => 'In Progress',
               'completed'   => 'Completed',
               default       => ucfirst(str_replace('_', ' ', $this->status)),
          };
     }
}
