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
                'message' => 'No tickets registered'
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
        $ticket->id_address = $request->input('id_address'); // if applicable
        $ticket->total = 0;
        $ticket->completed = 0;
        $ticket->deleted = 0;

        if ($ticket->save()) {
            return response()->json([
                'message' => 'Ticket created successfully',
                'ticket' => $ticket
            ], 201);
        } else {
            return response()->json([
                'message' => 'Error creating ticket'
            ], 500);
        }
    }



    public function store(Request $request)
    {
        // Verify that the ticket exists
        $Tickete = Ticket::findOrFail($request->id_Ticket);

        // Verify that the ticket is not complete
        if ($Tickete->completed === 1) {
            return response()->json(['message' => 'This ticket is already complete'], 400);
        }

        $producto = Producto::findOrFail($request->id_producto);

        // Verify if there is enough stock
        if ($producto->quantity < $request->quantity) {
            return response()->json(['message' => 'Not enough stock'], 400);
        }

        // Create the ticket line
        $ticketLine = new TicketLine();
        $ticketLine->id_Ticket = $request->id_Ticket;
        $ticketLine->id_producto = $request->id_producto;
        $ticketLine->quantity = $request->quantity;
        $ticketLine->price = $producto->price * $request->quantity;

        // Update product stock
        $producto->quantity -= $request->quantity;
        $producto->save();

        // Update ticket total
        $Tickete->total += $ticketLine->price;
        $Tickete->save();

        // Save the ticket line
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
                    'message' => 'Ticket updated'
                ], 200);
            }
        }

        return response()->json(['message' => 'Ticket not found'], 404);
    }

    public function delete(Request $request)
    {

        $user = Ticket::find($request->id);

        if ($user) {
            if ($user->delete()) {
                return response()->json([
                    'message' => 'Ticket deleted'
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Error deleting ticket'
                ], 500);
            }
        } else {
            return response()->json([
                'message' => 'Ticket not found'
            ], 404);
        }
    }
}
