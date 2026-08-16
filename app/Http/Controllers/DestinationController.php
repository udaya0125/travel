<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
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

        $destinations->getCollection()->transform(function ($destination) {
            return $this->withSingleImage($destination);
        });

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

            // Single image for now. Kept as its own relation row (not a
            // column on destinations) so this can grow back into
            // multiple images later without a schema change.
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // 2MB
        ]);

        $destination = Destination::create([
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'rating'      => $validated['rating'] ?? null,
            'price'       => $validated['price'] ?? null,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Store Destination Image
        |--------------------------------------------------------------------------
        */
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('destinations', 'public');

            $destination->images()->create([
                'image' => $path,
            ]);
        }

        $destination->load('images');

        $this->logActivity($request, "Created destination: {$destination->title}");

        return response()->json([
            'success' => true,
            'message' => 'Destination created successfully.',
            'data' => $this->withSingleImage($destination),
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
            'data' => $this->withSingleImage($destination),
        ]);
    }

    /**
     * Update the specified destination.
     */
    public function update(Request $request, $id)
    {
        $destination = Destination::with('images')->findOrFail($id);

        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'rating'       => 'nullable|numeric|min:0|max:5',
            'price'        => 'nullable|numeric|min:0',

            'image'        => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // 2MB
            // Set when the user removed the image without picking a replacement.
            'remove_image' => 'nullable|boolean',
        ]);

        $destination->update([
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'rating'      => $validated['rating'] ?? null,
            'price'       => $validated['price'] ?? null,
        ]);

        $replacingImage = $request->hasFile('image');
        $removingImage  = (bool) ($validated['remove_image'] ?? false);

        /*
        |--------------------------------------------------------------------------
        | Replace / Remove Existing Image
        |--------------------------------------------------------------------------
        | Only one image is kept at a time right now, so a new upload or an
        | explicit removal clears out whatever is already attached first.
        */
        if ($replacingImage || $removingImage) {
            foreach ($destination->images as $image) {
                if ($image->image && Storage::disk('public')->exists($image->image)) {
                    Storage::disk('public')->delete($image->image);
                }

                $image->delete();
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Add New Image
        |--------------------------------------------------------------------------
        */
        if ($replacingImage) {
            $path = $request->file('image')->store('destinations', 'public');

            $destination->images()->create([
                'image' => $path,
            ]);
        }

        $destination->load('images');

        $this->logActivity($request, "Updated destination: {$destination->title}");

        return response()->json([
            'success' => true,
            'message' => 'Destination updated successfully.',
            'data' => $this->withSingleImage($destination),
        ]);
    }

    /**
     * Remove the specified destination.
     */
    public function destroy($id)
    {
        $destination = Destination::with('images')->findOrFail($id);

        $title = $destination->title;

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

        $this->logActivity(request(), "Deleted destination: {$title}");

        return response()->json([
            'success' => true,
            'message' => 'Destination deleted successfully.',
        ]);
    }

    /**
     * Append a convenience `image` (singular) attribute mirroring the first
     * related image, so the frontend can consume a single field while the
     * underlying relation stays ready for multiple images later.
     */
    protected function withSingleImage(Destination $destination): Destination
    {
        $destination->setAttribute('image', optional($destination->images->first())->image);

        return $destination;
    }

    /**
     * Record an activity log entry.
     */
    protected function logActivity(Request $request, string $title): void
    {
        ActivityLog::create([
            'name'       => optional($request->user())->name ?? 'Guest',
            'ip_address' => $request->ip(),
            'title'      => $title,
        ]);
    }
}