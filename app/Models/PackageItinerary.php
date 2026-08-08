<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackageItinerary extends Model
{
    //
     protected $fillable = [
        'package_id',
        'day',
        'title',
        'description',
    ];

    
    /**
     * Itinerary belongs to a package.
     */
    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}
