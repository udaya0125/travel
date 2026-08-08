<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Destination extends Model
{
    //
    protected $fillable = [
        'title',
        'description',
        'rating',
        'price',
        'slug',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($destination) {
            $destination->slug = Str::slug($destination->title).'-'.$destination->id;

            $destination->saveQuietly();
        });
    }

    public function images()
    {
        return $this->hasMany(DestinationImage::class);
    }

    public function packages()
    {
        return $this->hasMany(Package::class);
    }
}
