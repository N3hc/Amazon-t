<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function getCardsByIds(Request $request)
    {
        $ids = $request->input('ids'); // espera un array

        $cards = Card::whereIn('id_card', $ids)->get();

        return response()->json($cards);
    }

    public function index(Request $request)
    {
        $query = Card::query();

        if ($request->id) {
            return response()->json(Card::findOrFail($request->id));
        }

        if ($request->id_set) {
            $query->where('id_set', $request->id_set);
        }

        if ($request->id_card) {
            $query->where('id_card', $request->id_card);
        }

        $cards = $query->get();

        if ($cards->isEmpty()) {
            return response()->json(['message' => 'No hay cartas registradas'], 404);
        }

        return response()->json($cards, 200);
    }

    public function showFromSet($id)
    {
        $cards = Card::where('id_set', $id)->get();

        if ($cards->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron cartas para este set'
            ], 404);
        }

        return response()->json($cards, 200);
    }

    public function indexCardsByUserProduct($request)
    {
        if ($request->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron cartas para este set'
            ], 404);
        }

        $temp = Card::whereIn('id_card', $request)
            ->where('deleted', 0)
            ->get();

        return response()->json($temp, 200);
    }

    public function update(Request $request)
    {
        $card = Card::find($request->id);

        if ($card) {
            if ($request->has('name')) {
                $card->name = $request->name;
            }
            if ($request->has('image')) {
                $card->image = $request->image;
            }
            if ($request->has('id_card')) {
                $card->id_card = $request->id_card;
            }
            if ($request->has('id_set')) {
                $card->id_set = $request->id_set;
            }
            if ($request->has('deleted')) {
                $card->deleted = $request->deleted;
            }
            if ($request->has('description')) {
                $card->description = $request->description;
            }

            $card->description = json_encode($card->description);
            $card->save();

            return response()->json([
                'name' => $card->name,
                'image' => $card->image,
                'id_card' => $card->id_card,
                'id_set' => $card->id_set,
                'description' => $card->description,
                'deleted' => $card->deleted
            ], 200);
        }

        return response()->json(['message' => 'Carta no encontrada'], 404);
    }

    public function store(Request $request)
    {
        $card = new Card();

        $card->id_card = $request->id_card;
        $card->id_set = $request->id_set;
        $card->name = $request->name;
        $card->image = $request->image;
        $card->description = $request->description;

        if ($card->save()) {
            return response()->json([
                'name' => $card->name,
                'image' => $card->image,
                'id_card' => $card->id_card,
                'id_set' => $card->id_set,
                'description' => $card->description,
                'message' => 'Carta guardada'
            ], 200);
        }

        return response()->json(['message' => 'Error al guardar la carta'], 500);
    }

    public function delete(Request $request)
    {
        $card = Card::find($request->id);

        if ($card) {
            if ($card->delete()) {
                return response()->json(['message' => 'Carta eliminada'], 200);
            }
            return response()->json(['message' => 'Error al eliminar la carta'], 500);
        }

        return response()->json(['message' => 'Carta no encontrada'], 404);
    }
}
