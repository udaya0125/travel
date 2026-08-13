<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\PackageController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


  Route::get('/package', [PackageController::class, 'index']);

  Route::get('/destinations', [DestinationController::class, 'index']);

  Route::get('/package/{slug}', [PackageController::class, 'indexShowPackageSlug']);


    Route::get('/indexpackage', [PackageController::class, 'indexList']);


  