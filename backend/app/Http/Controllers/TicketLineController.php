<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketLine;
use App\Models\Producto;
use Illuminate\Http\Request;

class TicketLineController extends Controller
{
    public function index(Request $request)
    {
        if (TicketLine::all()->isEmpty()) {
            return response()->json([
                'message' => 'No hay lineas de tíquets registradas'
            ], 404);
        } elseif ($request->id) {
            $user = TicketLine::findOrFail($request->id);
            return response()->json($user, 200);
        } elseif (TicketLine::all()->isNotEmpty()) {
            $user = TicketLine::all();
            return response()->json($user, 200);
        }
    }


    public function updateQuantity(Request $request)
{
    $ticketLine = TicketLine::where('id_Ticket', $request->id_Ticket)
                           ->where('id_producto', $request->id_producto)
                           ->first();

    if (!$ticketLine) {
        return response()->json(['message' => 'Línea de ticket no encontrada'], 404);
    }

    $producto = Producto::findOrFail($request->id_producto);
    $diferencia = $request->quantity - $ticketLine->quantity;

    // Validar stock
    if ($producto->quantity < $diferencia) {
        return response()->json(['message' => 'Stock insuficiente'], 400);
    }

    // Actualizar stock
    $producto->quantity -= $diferencia;
    $producto->save();

    // Actualizar línea de ticket
    $ticketLine->quantity = $request->quantity;
    $ticketLine->price = $producto->price * $request->quantity;
    $ticketLine->save();

    // Actualizar total del ticket
    $ticket = Ticket::findOrFail($request->id_Ticket);
    $ticket->total = TicketLine::where('id_Ticket', $ticket->id)->sum('price');
    $ticket->save();

    return response()->json(['message' => 'Cantidad actualizada con éxito']);
}


    public function store(Request $request)
    {
        $user = new TicketLine();
        $object = new Producto();
        $Tickete = new Ticket();
        $object = $object->findOrFail($request->id_producto);
        $Tickete = $Tickete->findOrFail($request->id_Ticket);
        $user->id_Ticket = $request->id_Ticket;
        $user->id_producto = $request->id_producto;
        $user->quantity = $request->quantity;
        $user->price = $request->quantity * $object->price;
        if($object->quantity < $request->quantity){
            return response()->json([
                'message' => 'No hay suficiente stock'
            ], 404);
        } else {
            $object->quantity -=  $request->quantity;
        }
        //Actualizar producto
        $product = new ProductoController();
        $TicketController = new TicketController();

        $requesty = ["id" => $request->id_producto, "quantity" => $object->quantity];
        $requestInstance = new Request($requesty);
        $product->update($requestInstance);
        $object = $object->fresh();
        if($object->quantity  == 0){
            $requesty = ["id" => $request->id_producto, "deleted" => 1];
            $requestInstance = new Request($requesty);
            $product->update($requestInstance);
        }
        //Actualziar Ticket


        $requesty = ["id" => $request->id_Ticket, "total" => ($Tickete->total + $user->price)];
        $requestInstance = new Request($requesty);
        $TicketController->update($requestInstance);

        $user->save();

        return response()->json([
            'id_Ticket' => $user->id_Ticket,
            'id_producto' => $user->id_producto,
            'quantity' => $user->quantity,
            'price' => $user->price
        ], 200);
    }

    public function update(Request $request)
    {
        $user = TicketLine::findOrFail($request->id);
        $object = new Producto();
        $object = $object->find($user->id_producto);
        $valor_arb = 0;
        $product = new ProductoController();
        $requesty = ["id" => $user->id_producto, "quantity" => ($object->quantity-($request->quantity-$user->quantity))];
        $requestInstance = new Request($requesty);
        $object = $object->find($request->id_producto);
        $total = $request->quantity * $object->price;
        if ($user) {


            if ($request->has('id_Ticket')) {
                $user->id_Ticket = $request->id_Ticket;
            }
            if ($request->has('id_producto')) {
                $user->id_producto = $request->id_producto;
            }
            if ($request->has('quantity')) {
                if ($object->quantity < $request->quantity) {
                    return response()->json([
                        'message' => 'No hay suficiente stock'
                    ], 404);
                } else {
                    $object->quantity -=  $request->quantity;
                    $valor_arb = $user->quantity;
                    $user->quantity = $request->quantity;
                    $product->update($requestInstance);
                    if($request->quantity == $valor_arb){
                        $requesty = ["id" => $request->id_producto, "deleted" => 1];
                        $requestInstance = new Request($requesty);
                        $product->update($requestInstance);
                    }
                    $user->price = $total;//Se ejecuta aquí porque se ha actualizado el producto así se actualiza el costo
                }
            }
            if ($request->has('deleted')) {
                $user->deleted = $request->deleted;
            }

            if ($user->save()) {
                return response()->json([
                    'id_Ticket' => $user->id_Ticket,
                    'id_producto' => $user->id_producto,
                    'quantity' => $user->quantity,
                    'price' => $user->price,
                    'deleted' => $user->deleted,
                    '$request'=>$request->quantity,
                    'valor_arb'=>$valor_arb,
                    'message' => 'Linea de Tíquet actualizado'
                ], 200);
            }
        }

        return response()->json(['message' => 'User not found'], 404);
    }

    public function delete(Request $request)
    {

        $user = TicketLine::find($request->id);
        $object = new Producto();
        $object = $object->find($user->id_producto);

        if ($user) {
            if ($user->delete()) {
                return response()->json([
                    'Message' => 'Linea de tíquet eliminada'
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Error al actualizar al usuario'
                ], 500);
            }
        } else {
            return response()->json([
                'message' => 'Linea de tíquet no encontrada'
            ], 404);
        }
    }

    public function deleteChenPing(Request $request)
{
    $ticketLine = \App\Models\TicketLine::where('id_Ticket', $request->id_Ticket)
                                       ->where('id_producto', $request->id_producto)
                                       ->first();

    if (!$ticketLine) {
        return response()->json([
            'message' => 'Línea de ticket no encontrada'
        ], 404);
    }

    $ticketLine->delete();

    return response()->json([
        'message' => 'Línea de ticket eliminada correctamente'
    ], 200);
}

}
