<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DestinationImage extends Model
{
    //

    protected $fillable = [
        'destination_id',
        'image',
    ];

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }
}
