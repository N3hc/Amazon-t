<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Ticket;
use App\Models\TicketLine;
use App\Models\Producto;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        if (Ticket::all()->isEmpty()) {
            return response()->json([
                'message' => 'No hay Tickets registrados'
            ], 404);
        } elseif ($request->id) {
            $user = Ticket::findOrFail($request->id);
            return response()->json($user, 200);
        } elseif ($request->id_user) {
            $user = Ticket::where('id_user', $request->id_user)->get();
            return response()->json($user, 200);
        }elseif (Ticket::all()->isNotEmpty()) {
            $user = Ticket::all();
            return response()->json($user, 200);
        }
    }

    public function create(Request $request)
{
    $ticket = new Ticket();
    $ticket->id_user = $request->input('id_user');
    $ticket->id_address = $request->input('id_address'); // si aplica
    $ticket->total = 0;
    $ticket->completed = 0;
    $ticket->deleted = 0;

    if ($ticket->save()) {
        return response()->json([
            'message' => 'Ticket creado correctamente',
            'ticket' => $ticket
        ], 201);
    } else {
        return response()->json([
            'message' => 'Error al crear el ticket'
        ], 500);
    }
}



public function store(Request $request)
{
    // Verifica que el ticket existe
    $Tickete = Ticket::findOrFail($request->id_Ticket);

    // Verifica que el ticket no esté completo
    if ($Tickete->completed === 1) {
        return response()->json(['message' => 'Este ticket ya está completo'], 400);
    }

    $producto = Producto::findOrFail($request->id_producto);

    // Verifica si hay suficiente stock
    if ($producto->quantity < $request->quantity) {
        return response()->json(['message' => 'No hay suficiente stock'], 400);
    }

    // Crea la línea de ticket
    $ticketLine = new TicketLine();
    $ticketLine->id_Ticket = $request->id_Ticket;
    $ticketLine->id_producto = $request->id_producto;
    $ticketLine->quantity = $request->quantity;
    $ticketLine->price = $producto->price * $request->quantity;

    // Actualiza el stock del producto
    $producto->quantity -= $request->quantity;
    $producto->save();

    // Actualiza el total del ticket
    $Tickete->total += $ticketLine->price;
    $Tickete->save();

    // Guarda la línea de ticket
    $ticketLine->save();

    return response()->json([
        'id_Ticket' => $ticketLine->id_Ticket,
        'id_producto' => $ticketLine->id_producto,
        'quantity' => $ticketLine->quantity,
        'price' => $ticketLine->price
    ], 200);
}


    public function update(Request $request)
    {
        $user = Ticket::findOrFail($request->id);

        if ($user) {


            if ($request->has('id_user')) {
                $user->id_user = $request->id_user;
            }
            if ($request->has('id_address')) {
                $user->id_address = $request->id_address;
            }
            if ($request->has('total')) {
                $user->total = $request->total;
            }
            if ($request->has('completed')) {
                $user->completed = $request->completed;
            }
            if ($request->has('deleted')) {
                $user->deleted = $request->deleted;
            }

            if ($user->save()) {
                return response()->json([
                    'id_user' => $user->id_user,
                    'id_address' => $user->id_address,
                    'total' => $user->total,
                    'completed' => $user->completed,
                    'deleted' => $user->deleted,
                    'message' => 'Tiquet actualizado'
                ], 200);
            }
        }

        return response()->json(['message' => 'User not found'], 404);
    }

    public function delete(Request $request)
    {

        $user = Ticket::find($request->id);

        if ($user) {
            if ($user->delete()) {
                return response()->json([
                    'Message' => 'Ticket eliminado'
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Error al actualizar al usuario'
                ], 500);
            }
        } else {
            return response()->json([
                'message' => 'Ticket no encontrado'
            ], 404);
        }
    }
}
