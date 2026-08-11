<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DestinationController extends Controller
{
    /**
     * Display a listing of destinations.
     */
    public function index()
    {
        $destinations = Destination::with('images')
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $destinations,
        ]);
    }

    /**
     * Store a newly created destination.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'rating'      => 'nullable|numeric|min:0|max:5',
            'price'       => 'nullable|numeric|min:0',

            'images'      => 'nullable|array',
            'images.*'    => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $destination = Destination::create([
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'rating'      => $validated['rating'] ?? null,
            'price'       => $validated['price'] ?? null,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Store Destination Images
        |--------------------------------------------------------------------------
        */
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {

                $path = $image->store('destinations', 'public');

                $destination->images()->create([
                    'image' => $path,
                ]);
            }
        }

        $destination->load('images');

        return response()->json([
            'success' => true,
            'message' => 'Destination created successfully.',
            'data' => $destination,
        ], 201);
    }

    /**
     * Display the specified destination.
     */
    public function show($id)
    {
        $destination = Destination::with('images')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $destination,
        ]);
    }

    /**
     * Update the specified destination.
     */
    public function update(Request $request, $id)
    {
        $destination = Destination::with('images')->findOrFail($id);

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'rating'      => 'nullable|numeric|min:0|max:5',
            'price'       => 'nullable|numeric|min:0',

            'images'      => 'nullable|array',
            'images.*'    => 'image|mimes:jpeg,png,jpg,webp|max:5120',

            // Existing image IDs that should remain
            'existing_images'   => 'nullable|array',
            'existing_images.*' => 'integer|exists:destination_images,id',
        ]);

        $destination->update([
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'rating'      => $validated['rating'] ?? null,
            'price'       => $validated['price'] ?? null,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Delete Removed Images
        |--------------------------------------------------------------------------
        */

        $existingImageIds = $validated['existing_images'] ?? [];

        $imagesToDelete = $destination->images()
            ->whereNotIn('id', $existingImageIds)
            ->get();

        foreach ($imagesToDelete as $image) {

            if ($image->image && Storage::disk('public')->exists($image->image)) {
                Storage::disk('public')->delete($image->image);
            }

            $image->delete();
        }

        /*
        |--------------------------------------------------------------------------
        | Add New Images
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('images')) {

            foreach ($request->file('images') as $image) {

                $path = $image->store('destinations', 'public');

                $destination->images()->create([
                    'image' => $path,
                ]);
            }
        }

        $destination->load('images');

        return response()->json([
            'success' => true,
            'message' => 'Destination updated successfully.',
            'data' => $destination,
        ]);
    }

    /**
     * Remove the specified destination.
     */
    public function destroy($id)
    {
        $destination = Destination::with('images')->findOrFail($id);

        /*
        |--------------------------------------------------------------------------
        | Delete All Destination Images
        |--------------------------------------------------------------------------
        */

        foreach ($destination->images as $image) {

            if ($image->image && Storage::disk('public')->exists($image->image)) {
                Storage::disk('public')->delete($image->image);
            }

            $image->delete();
        }

        /*
        |--------------------------------------------------------------------------
        | Delete Destination
        |--------------------------------------------------------------------------
        */

        $destination->delete();

        return response()->json([
            'success' => true,
            'message' => 'Destination deleted successfully.',
        ]);
    }
}