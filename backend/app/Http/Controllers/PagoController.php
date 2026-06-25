<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;

class PagoController extends Controller
{

    public function index(Request $request)
    {
        if (Pago::count() === 0) {
            return response()->json([
                'message' => 'No hay pagos registrados'
            ], 404);
        }

        if ($request->id) {
            $pago = Pago::find($request->id);
            if (!$pago) {
                return response()->json(['message' => 'Pago no encontrado'], 404);
            }

            // desencriptar campos
            $pago->number = Crypt::decryptString($pago->number);
            $pago->cvv = Crypt::decryptString($pago->cvv);

            return response()->json($pago, 200);
        }

        if ($request->id_user) {
            $pagos = Pago::where('user_id', $request->id_user)->get();
            if ($pagos->isEmpty()) {
                return response()->json(['message' => 'No hay pagos para este usuario'], 404);
            }

            foreach ($pagos as $pago) {
                $pago->number = Crypt::decryptString($pago->number);
                $pago->cvv = Crypt::decryptString($pago->cvv);
            }

            return response()->json($pagos, 200);
        }

        $pagos = Pago::all();
        foreach ($pagos as $pago) {
            $pago->number = Crypt::decryptString($pago->number);
            $pago->cvv = Crypt::decryptString($pago->cvv);
        }

        return response()->json($pagos, 200);
    }

    public function update(Request $request)
    {
        $card = Pago::find($request->id);


        if($card){
            if ($request->has('name')) {
                $card->name = $request->name;
            }
            if ($request->has('user_id')) {
                $card->user_id = $request->user_id;
            }
            if ($request->has('expiration_date')) {
                $card->expiration_date = Carbon::createFromFormat('d/m/Y', $request->expiration_date)->format('Y-m-d');
            }
            if ($request->has('number')) {
                $card->number = Hash::make($request->number);
            }if ($request->has('cvv')){
                $card->cvv = Hash::make($request->cvv);
            } if ($request->has('deleted')) {
                $card->deleted = $request->deleted;
            }
        }
        $card->save();

        return response()->json([
            'name' => $card->name,
            'user_id' => $card->user_id,
            'expiration_date' => $card->expiration_date,
            'number' => $card->number,
            'cvv' => $card->cvv,
            'deleted' => $card->deleted,
        ], 200);
    }

    public function store(Request $request)
    {
        $card = new Pago();

        if ($card) {
            $card->user_id = $request->user_id;
            $card->name = $request->name;
            $card->number =Crypt::encryptString($request->number);
            $card->expiration_date = Carbon::createFromFormat('d/m/Y', $request->expiration_date)->format('Y-m-d');
            $card->cvv = Crypt::encryptString($request->cvv);



            if ($card->save()) {
                return response()->json([
                    'user_id' => $card->user_id,
                    'name' => $card->name,
                    'number' => $card->number,
                    'expiration_date' => $card->expiration_date,
                    'cvv' => $card->cvv,
                    'message' => 'Pago registrado correctamente'
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Error al actualizar la Tarjeta'
                ], 500);
            }
        } else {
            return response()->json([
                'message' => 'Tarjeta no encontrada'
            ], 404);
        }
    }

    public function delete(Request $request)
    {

        $card = Pago::find($request->id);

        if ($card) {
            if ($card->delete()) {
                return response()->json([
                    'Message' => 'Tarjeta eliminada'
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Error al actualizar la Tarjeta'
                ], 500);
            }
        } else {
            return response()->json([
                'message' => 'Tarjeta no encontrada'
            ], 404);
        }
    }
}
