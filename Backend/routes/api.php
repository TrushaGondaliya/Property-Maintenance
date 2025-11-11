<?php

use App\Http\Controllers\PropertyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkOrderController;

//auth api
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

//properties crud api
Route::prefix('property')->middleware('auth:sanctum')->group(function () {
    Route::get('/list', [PropertyController::class, 'list']);
    Route::post('/store', [PropertyController::class, 'store']);
    Route::patch('/update', [PropertyController::class, 'update']);
    Route::delete('/delete', [PropertyController::class, 'delete']);
});

//work order crud api
Route::prefix('work_order')->middleware('auth:sanctum')->group(function () {
    Route::get('/getWorkOrders', [WorkOrderController::class, 'getWorkOrders']);
    Route::post('/storeWorkOrder', [WorkOrderController::class, 'storeWorkOrder']);
    Route::patch('/updateWorkOrder', [WorkOrderController::class, 'updateWorkOrder']);
    Route::delete('/deleteWorkOrder', [WorkOrderController::class, 'deleteWorkOrder']);
    Route::patch('/updateWorkOrderStatus', [WorkOrderController::class, 'updateWorkOrderStatus']);
});