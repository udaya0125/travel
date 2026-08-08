<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Package extends Model
{
    //
    protected $fillable = [
        'title',
        'days',
        'people',
        'resort',
        'price',
        'emoji',
        'destination_id',
        'category',
        'description',
        'includes',
        'excludes',
        'slug',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($package) {
            $slug = Str::slug($package->title);

            $package->slug = $slug.'-'.$package->id;

            // Avoid triggering model events again
            $package->saveQuietly();
        });
    }

    /**
     * Package belongs to a destination.
     */
    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    /**
     * Package images.
     */
    public function images()
    {
        return $this->hasMany(PackageImage::class);
    }

    /**
     * Package itinerary.
     */
    public function itineraries()
    {
        return $this->hasMany(PackageItinerary::class)
            ->orderBy('day');
    }
}
