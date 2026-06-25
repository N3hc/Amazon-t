<?php
use App\Http\Controllers\AddressController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\userController;
use App\Http\Controllers\categoriesController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TicketLineController;
use App\Http\Controllers\PagoController;
use Illuminate\Http\Request; // Ensure this line is present and correctly imported
use Illuminate\Support\Facades\Route; // Import the Route facade

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/store/user', [userController::class, 'store']);
Route::put('/update/user', [userController::class, 'update']);
Route::delete('/delete/user', [userController::class, 'delete']);
Route::get('/index/user', [userController::class, 'index']);
Route::post('/login/user', [userController::class,'login']);

Route::post('/store/card', [CardController::class, 'store']);
Route::post('/getcardsByIds/card', [CardController::class, 'getcardsByIds']);
Route::put('/update/card', [CardController::class, 'update']);
Route::delete('/delete/card', [CardController::class, 'delete']);
Route::get('/index/card', [CardController::class, 'index']);
Route::get('/indexcardsByUserProduct/card', [CardController::class, 'indexcardsByUserProduct']);

Route::post('/store/products', [ProductoController::class, 'store']);
Route::put('/update/products', [ProductoController::class, 'update']);
Route::delete('/delete/products', [ProductoController::class, 'delete']);
Route::get('/index/products', [ProductoController::class, 'index']);
Route::get('/onlyIdcardIndex/products', [ProductoController::class, 'onlyIdcardIndex']);

Route::post('/store/categories', [categoriesController::class, 'store']);
Route::put('/update/categories', [categoriesController::class, 'update']);
Route::delete('/delete/categories', [categoriesController::class, 'delete']);
Route::get('/index/categories', [categoriesController::class, 'index']);


Route::get('/index/address', [AddressController::class, 'index']);
Route::post('/store/address', [AddressController::class, 'store']);
Route::put('/update/address', [AddressController::class, 'update']);
Route::delete('/delete/address', [AddressController::class, 'delete']);


Route::get('/index/Tickets', [TicketController::class, 'index']);
Route::post('/store/Tickets', [TicketController::class, 'store']);
Route::put('/update/tickets', [TicketController::class, 'update']); // <- minúscula como en Angular
Route::delete('/delete/tickets', [TicketController::class, 'delete']); // <- igual aquí
Route::post('/Tickets/create', [TicketController::class, 'create']);
Route::post('/update/Ticket-quantity', [TicketController::class, 'updateQuantity']);


Route::get('/index/Ticket_lineas', [TicketLineController::class, 'index']);
Route::post('/store/Ticket_lineas', [TicketLineController::class, 'store']);
Route::put('/update/Ticket_lineas', [TicketLineController::class, 'update']);
Route::delete('/delete/Ticket_lineas', [TicketLineController::class, 'delete']);
Route::delete('/delete/ticket_lineas_chenping', [TicketLineController::class, 'deleteChenPing']);

Route::post('/store/pago', [PagoController::class, 'store']);
Route::put('/update/pago', [PagoController::class, 'update']);
Route::delete('/delete/pago', [PagoController::class, 'delete']);
Route::get('/index/pago', [PagoController::class, 'index']);
