<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PackageController extends Controller
{
    /**
     * Display a listing of packages.
     */
    public function index()
    {
        $packages = Package::with([
            'images',
            'itineraries',
            'destination',
        ])
        ->latest()
        ->paginate(10);

        return response()->json([
            'status' => true,
            'message' => 'Packages fetched successfully.',
            'data' => $packages,
        ]);
    }


    /**
     * Store a newly created package.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'days' => 'nullable|string|max:255',
            'people' => 'nullable|string|max:255',
            'resort' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'destination_id' => 'nullable|exists:destinations,id',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'includes' => 'nullable|string',
            'excludes' => 'nullable|string',

            // Emoji is now an image upload (a small package icon/thumbnail)
            'emoji' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:2048',

            // Gallery images
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',

            // Itinerary
            'itineraries' => 'nullable|array',
            'itineraries.*.day' => 'nullable|integer|min:1',
            'itineraries.*.title' => 'nullable|string|max:255',
            'itineraries.*.description' => 'nullable|string',
        ]);

        DB::beginTransaction();

        $emojiPath = null;

        try {
            /*
             * Upload emoji/icon image, if provided.
             */
            if ($request->hasFile('emoji')) {
                $emojiPath = $request->file('emoji')->store(
                    'packages/emoji',
                    'public'
                );
            }

            /*
             * Create Package
             *
             * The Package model boot() function will automatically
             * generate the slug using the package ID.
             */
            $package = Package::create([
                'title' => $validated['title'],
                'days' => $validated['days'] ?? null,
                'people' => $validated['people'] ?? null,
                'resort' => $validated['resort'] ?? null,
                'price' => $validated['price'] ?? null,
                'emoji' => $emojiPath,
                'destination_id' => $validated['destination_id'] ?? null,
                'category' => $validated['category'] ?? null,
                'description' => $validated['description'] ?? null,
                'includes' => $validated['includes'] ?? null,
                'excludes' => $validated['excludes'] ?? null,
            ]);


            /*
             * Store Images
             */
            if ($request->hasFile('images')) {

                foreach ($request->file('images') as $image) {

                    $path = $image->store(
                        'packages',
                        'public'
                    );

                    $package->images()->create([
                        'image' => $path,
                    ]);
                }
            }


            /*
             * Store Itinerary
             */
            if (!empty($validated['itineraries'])) {

                foreach ($validated['itineraries'] as $itinerary) {

                    $package->itineraries()->create([
                        'day' => $itinerary['day'] ?? null,
                        'title' => $itinerary['title'] ?? null,
                        'description' => $itinerary['description'] ?? null,
                    ]);
                }
            }


            DB::commit();

            $package->load([
                'images',
                'itineraries',
                'destination',
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Package created successfully.',
                'data' => $package,
            ], 201);

        } catch (\Throwable $e) {

            DB::rollBack();

            // Clean up the uploaded emoji if the transaction failed
            if ($emojiPath && Storage::disk('public')->exists($emojiPath)) {
                Storage::disk('public')->delete($emojiPath);
            }

            return response()->json([
                'status' => false,
                'message' => 'Failed to create package.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Update the specified package.
     */
    public function update(Request $request, $id)
    {
        $package = Package::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'days' => 'nullable|string|max:255',
            'people' => 'nullable|string|max:255',
            'resort' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'destination_id' => 'nullable|exists:destinations,id',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'includes' => 'nullable|string',
            'excludes' => 'nullable|string',

            // Emoji/icon image: either a new file, or a flag to remove the existing one
            'emoji' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
            'remove_emoji' => 'nullable|boolean',

            // New gallery images
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',

            // Existing gallery images that should remain
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'integer|exists:package_images,id',

            // Itinerary
            'itineraries' => 'nullable|array',
            'itineraries.*.day' => 'nullable|integer|min:1',
            'itineraries.*.title' => 'nullable|string|max:255',
            'itineraries.*.description' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {

            /*
             * Handle emoji/icon image.
             *
             * - New file uploaded  -> delete old one (if any), store new one.
             * - remove_emoji=true  -> delete old one, clear the field.
             * - Neither            -> leave the existing value untouched.
             */
            $emojiPath = $package->emoji;

            if ($request->hasFile('emoji')) {

                if ($emojiPath && Storage::disk('public')->exists($emojiPath)) {
                    Storage::disk('public')->delete($emojiPath);
                }

                $emojiPath = $request->file('emoji')->store('packages/emoji', 'public');

            } elseif ($request->boolean('remove_emoji') && $emojiPath) {

                if (Storage::disk('public')->exists($emojiPath)) {
                    Storage::disk('public')->delete($emojiPath);
                }

                $emojiPath = null;
            }


            /*
             * Update package information.
             */
            $package->update([
                'title' => $validated['title'],
                'days' => $validated['days'] ?? null,
                'people' => $validated['people'] ?? null,
                'resort' => $validated['resort'] ?? null,
                'price' => $validated['price'] ?? null,
                'emoji' => $emojiPath,
                'destination_id' => $validated['destination_id'] ?? null,
                'category' => $validated['category'] ?? null,
                'description' => $validated['description'] ?? null,
                'includes' => $validated['includes'] ?? null,
                'excludes' => $validated['excludes'] ?? null,
            ]);


            /*
             * Handle Gallery Images
             *
             * existing_images contains IDs of images that
             * should NOT be deleted.
             */
            $existingImageIds = $validated['existing_images'] ?? [];

            $oldImages = $package->images()
                ->whereNotIn('id', $existingImageIds)
                ->get();

            foreach ($oldImages as $oldImage) {

                if ($oldImage->image) {
                    Storage::disk('public')->delete($oldImage->image);
                }

                $oldImage->delete();
            }


            /*
             * Upload new images.
             */
            if ($request->hasFile('images')) {

                foreach ($request->file('images') as $image) {

                    $path = $image->store(
                        'packages',
                        'public'
                    );

                    $package->images()->create([
                        'image' => $path,
                    ]);
                }
            }


            /*
             * Replace itinerary.
             *
             * Delete old itinerary records and create
             * the new ones.
             */
            $package->itineraries()->delete();

            if (!empty($validated['itineraries'])) {

                foreach ($validated['itineraries'] as $itinerary) {

                    $package->itineraries()->create([
                        'day' => $itinerary['day'] ?? null,
                        'title' => $itinerary['title'] ?? null,
                        'description' => $itinerary['description'] ?? null,
                    ]);
                }
            }


            DB::commit();

            $package->load([
                'images',
                'itineraries',
                'destination',
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Package updated successfully.',
                'data' => $package,
            ]);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Failed to update package.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Remove the specified package.
     */
    public function destroy($id)
    {
        $package = Package::findOrFail($id);

        DB::beginTransaction();

        try {

            /*
             * Delete emoji/icon image from storage.
             */
            if ($package->emoji && Storage::disk('public')->exists($package->emoji)) {
                Storage::disk('public')->delete($package->emoji);
            }


            /*
             * Delete package gallery images from storage.
             */
            foreach ($package->images as $image) {

                if ($image->image) {
                    Storage::disk('public')->delete($image->image);
                }

                $image->delete();
            }


            /*
             * Delete itinerary.
             */
            $package->itineraries()->delete();


            /*
             * Delete package.
             */
            $package->delete();

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Package deleted successfully.',
            ]);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Failed to delete package.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}