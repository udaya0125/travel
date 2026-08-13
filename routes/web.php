<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\ActivityLogsController;
use App\Http\Controllers\UserController;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');



    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    // Page Routes for Country Page
    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    Route::get('/destination',function(){
        return Inertia::render('AdminPages/Destination');
    });

    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    // Controller Routes for Country Page
    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    Route::get('/ourdestinations', [DestinationController::class, 'index'])->name('ourdestinations.index');
    Route::post('/ourdestinations', [DestinationController::class, 'store'])->name('ourdestinations.store');
    Route::put('/ourdestinations/{id}', [DestinationController::class, 'update'])->name('ourdestinations.update');
    Route::delete('/ourdestinations/{id}', [DestinationController::class, 'destroy'])->name('ourdestinations.destroy');


     Route::get('/package',function(){
        return Inertia::render('AdminPages/Package');
    });

    Route::get('/ourpackage', [PackageController::class, 'index'])->name('ourpackage.index');
    Route::post('/ourpackage', [PackageController::class, 'store'])->name('ourpackage.store');
    Route::put('/ourpackage/{id}', [PackageController::class, 'update'])->name('ourpackage.update');
    Route::delete('/ourpackage/{id}', [PackageController::class, 'destroy'])->name('ourpackage.destroy');
    Route::delete('ourpackage/images/{imageId}', [PackageController::class, 'destroyImage'])->name('ourpackage.images.destroy');


     Route::get('/',function(){
        return Inertia::render('AdminPages/Dashboard');
    });

    Route::get('/user-management', function(){
        return Inertia::render('AdminPages/UserManagement');
    });


    Route::get('/ourusers', [UserController::class, 'index'])->name('ourusers.index');
    Route::post('/ourusers', [UserController::class, 'store'])->name('ourusers.store');
    Route::put('/ourusers/{id}', [UserController::class, 'update'])->name('ourusers.update');
    Route::delete('/ourusers/{id}', [UserController::class, 'destroy'])->name('ourusers.destroy');

    Route::get("/activity-logs",function(){
        return Inertia::render("AdminPages/ActivityLog");
    });

    // ###################################
    // Activity Logs API Route
    //####################################

    Route::get('/ourlogs', [ActivityLogsController::class, 'index'])->name('ourlogs.index'); 
    
    });

require __DIR__.'/auth.php';
