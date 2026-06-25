<?php

namespace App\Http\Controllers;

use App\Models\address;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Response;

class AddressController  extends Controller
{



public function index(Request $request)
{
    if ($request->id) {
        $card = Address::find($request->id);
        return $card 
            ? response()->json($card, 200) 
            : response()->json(['message' => 'Dirección no encontrada'], 404);
    }

    if ($request->id_user) {
        $cards = Address::where('id_user', $request->id_user)->get();
        return $cards->isEmpty()
            ? response()->json(['message' => 'No hay direcciones registradas para este usuario'], 404)
            : response()->json($cards, 200);
    }

    $cards = Address::all();
    return $cards->isEmpty()
        ? response()->json(['message' => 'No hay direcciones registradas'], 404)
        : response()->json($cards, 200);
}

    public function update(Request $request)
    {
        $card = address::find($request->id);

        if($card){
            if ($request->has('address')) {
                $card->address = $request->address;
            }
            if ($request->has('number')) {
                $card->number = $request->number;
            }
            if ($request->has('id_user')) {
                $card->id_user = $request->id_user;
            }
            if ($request->has('deleted')){
                $card->deleted = $request->deleted;
            }
        }
        $card->save();

        return response()->json([
            'address' => $card->address,
            'number' => $card->number,
            'id_user' => $card->id_user,
            'deleted' => $card->deleted,
        ], 200);
    }

    public function store(Request $request)
    {
        $card = new address();

        if ($card) {
            $card->address = $request->address;
            $card->number = $request->number;
            $card->id_user = $request->id_user;

            if ($card->save()) {
                return response()->json([
                    'address' => $card->address,
                    'number' => $card->number,
                    'id_user' => $card->id_user,
                    'message' => 'Dirección actualizada'
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Error al actualizar la Dirección'
                ], 500);
            }
        } else {
            return response()->json([
                'message' => 'Dirección no encontrada'
            ], 404);
        }
    }

    public function delete(Request $request)
    {

        $card = address::find($request->id);

        if ($card) {
            if ($card->delete()) {
                return response()->json([
                    'Message' => 'Dirección eliminada'
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Error al actualizar la Dirección'
                ], 500);
            }
        } else {
            return response()->json([
                'message' => 'Dirección no encontrada'
            ], 404);
        }
    }
}
