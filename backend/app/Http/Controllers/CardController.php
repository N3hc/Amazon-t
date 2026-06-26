<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;

class CardController extends Controller
{
    use ApiResponse;

    private function translateCard($card, $lang)
    {
        if (!$card) return $card;

        // Translate name
        $names = json_decode($card->name, true);
        if (is_array($names)) {
            $card->name = $names[$lang] ?? $names['en'] ?? $card->name;
        }

        // Translate description (which is the full card JSON)
        $descriptions = json_decode($card->description, true);
        if (is_array($descriptions)) {
            if (isset($descriptions['en']) || isset($descriptions['es'])) {
                $selectedDesc = $descriptions[$lang] ?? $descriptions['en'] ?? null;
                if ($selectedDesc) {
                    $card->description = json_encode($selectedDesc);
                }
            }
        }

        return $card;
    }

    private function getRequestedLang(Request $request)
    {
        $lang = $request->header('Accept-Language') ?? $request->query('lang') ?? 'en';
        return str_contains(strtolower($lang), 'es') ? 'es' : 'en';
    }

    public function getCardsByIds(Request $request)
    {
        $lang = $this->getRequestedLang($request);
        $ids = $request->input('ids') ?? [];

        $cards = Card::whereIn('id_card', $ids)->get();

        foreach ($cards as $card) {
            $this->translateCard($card, $lang);
        }

        return $this->successResponse($cards);
    }

    public function index(Request $request)
    {
        $lang = $this->getRequestedLang($request);
        $query = Card::query();

        if ($request->id) {
            $card = Card::findOrFail($request->id);
            $this->translateCard($card, $lang);
            return $this->successResponse($card);
        }

        if ($request->id_set) {
            $query->where('id_set', $request->id_set);
        }

        if ($request->id_card) {
            $query->where('id_card', $request->id_card);
        }

        $cards = $query->get();

        if ($cards->isEmpty()) {
            return $this->errorResponse('No hay cartas registradas', 404);
        }

        foreach ($cards as $card) {
            $this->translateCard($card, $lang);
        }

        return $this->successResponse($cards);
    }

    public function showFromSet(Request $request, $id)
    {
        $lang = $this->getRequestedLang($request);
        $cards = Card::where('id_set', $id)->get();

        if ($cards->isEmpty()) {
            return $this->errorResponse('No se encontraron cartas para este set', 404);
        }

        foreach ($cards as $card) {
            $this->translateCard($card, $lang);
        }

        return $this->successResponse($cards);
    }

    public function indexCardsByUserProduct($request)
    {
        $lang = str_contains(strtolower(request()->header('Accept-Language') ?? request()->query('lang') ?? 'en'), 'es') ? 'es' : 'en';

        if ($request->isEmpty()) {
            return $this->errorResponse('No se encontraron cartas para este set', 404);
        }

        $temp = Card::whereIn('id_card', $request)
            ->where('deleted', 0)
            ->get();

        foreach ($temp as $card) {
            $this->translateCard($card, $lang);
        }

        return $this->successResponse($temp);
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

            return $this->successResponse([
                'name' => $card->name,
                'image' => $card->image,
                'id_card' => $card->id_card,
                'id_set' => $card->id_set,
                'description' => $card->description,
                'deleted' => $card->deleted
            ]);
        }

        return $this->errorResponse('Carta no encontrada', 404);
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
            return $this->successResponse([
                'name' => $card->name,
                'image' => $card->image,
                'id_card' => $card->id_card,
                'id_set' => $card->id_set,
                'description' => $card->description,
                'message' => 'Carta guardada'
            ]);
        }

        return $this->errorResponse('Error al guardar la carta', 500);
    }

    public function delete(Request $request)
    {
        $card = Card::find($request->id);

        if ($card) {
            if ($card->delete()) {
                return $this->successResponse(['message' => 'Carta eliminada']);
            }
            return $this->errorResponse('Error al eliminar la carta', 500);
        }

        return $this->errorResponse('Carta no encontrada', 404);
    }
}
