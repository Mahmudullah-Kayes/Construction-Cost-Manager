<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\LaborCostController;
use App\Http\Controllers\MiscCostController;
use App\Http\Controllers\ElectricalCostController;
use App\Http\Controllers\PlumbingCostController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes - Cost management (no authentication required)
Route::prefix('v1')->group(function () {
    Route::apiResource('materials', MaterialController::class);
    Route::apiResource('labor-costs', LaborCostController::class);
    Route::apiResource('misc-costs', MiscCostController::class);
    Route::apiResource('electrical-costs', ElectricalCostController::class);
    Route::apiResource('plumbing-costs', PlumbingCostController::class);
    
    // Auth routes
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// Protected routes (authentication required)
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // User management routes
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});
