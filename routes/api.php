<?php
use App\Http\Controllers\Api\SensorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/sensor', [SensorController::class, 'index']);
Route::post('/sensor', [SensorController::class, 'store']);
