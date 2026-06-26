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

        // Keep English image URLs as fallbacks
        $descriptions = json_decode($card->description, true);
        if (is_array($descriptions)) {
            $card->image_small_en = $descriptions['en']['images']['small'] ?? $card->image_small;
            $card->image_large_en = $descriptions['en']['images']['large'] ?? $card->image_large;
        } else {
            $card->image_small_en = $card->image_small;
            $card->image_large_en = $card->image_large;
        }

        // Translate name
        $names = json_decode($card->name, true);
        if (is_array($names)) {
            $card->name = $names[$lang] ?? $names['en'] ?? $card->name;
        }

        // Translate description (which is the full card JSON)
        if (is_array($descriptions)) {
            if (isset($descriptions['en']) || isset($descriptions['es'])) {
                $selectedDesc = $descriptions[$lang] ?? $descriptions['en'] ?? null;
                if ($selectedDesc) {
                    $card->description = json_encode($selectedDesc);
                    if (isset($selectedDesc['images']['small'])) {
                        $card->image_small = $selectedDesc['images']['small'];
                    }
                    if (isset($selectedDesc['images']['large'])) {
                        $card->image_large = $selectedDesc['images']['large'];
                    }
                }
            }
        }

        return $card;
    }

    private function ensureDetailedCard($card)
    {
        if (!$card) return;

        $descriptions = json_decode($card->description, true);
        if (!is_array($descriptions)) return;

        // If 'illustrator' is set, it means we already have the detailed card cached
        if (isset($descriptions['en']['illustrator'])) {
            return;
        }

        // It is a basic card, let's fetch the full details on the fly!
        $cardId = $card->id_card;
        
        try {
            $resCardEn = \Illuminate\Support\Facades\Http::withoutVerifying()->timeout(15)->get("https://api.tcgdex.net/v2/en/cards/{$cardId}");
            $resCardEs = \Illuminate\Support\Facades\Http::withoutVerifying()->timeout(15)->get("https://api.tcgdex.net/v2/es/cards/{$cardId}");

            if ($resCardEn->successful() && $resCardEs->successful()) {
                $enDetails = $resCardEn->json();
                $esDetails = $resCardEs->json();

                // Map English and Spanish details
                $enDesc = $this->mapCardDetails($enDetails, $enDetails, 'en');
                $esDesc = $this->mapCardDetails($esDetails, $esDetails, 'es');

                $newDescription = [
                    'en' => $enDesc,
                    'es' => $esDesc
                ];

                // Update the card in the database
                $card->description = json_encode($newDescription, JSON_UNESCAPED_UNICODE);
                
                if (isset($enDesc['images']['small'])) {
                    $card->image_small = $enDesc['images']['small'];
                }
                if (isset($enDesc['images']['large'])) {
                    $card->image_large = $enDesc['images']['large'];
                }

                $card->save();
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Error fetching card details on the fly: " . $e->getMessage());
        }
    }

    private function mapCardDetails($details, $summary, $lang)
    {
        $name = $details['name'] ?? $summary['name'];
        $image = $details['image'] ?? $summary['image'];

        // Base structure
        $mapped = [
            'id' => $details['id'] ?? $summary['id'],
            'name' => $name,
            'supertype' => $details['category'] ?? ($lang === 'es' ? 'Entrenador/Pokémon' : 'Trainer/Pokémon'),
            'subtypes' => isset($details['stage']) ? [$details['stage']] : [],
            'evolvesFrom' => $details['evolveFrom'] ?? null,
            'rarity' => $details['rarity'] ?? ($lang === 'es' ? 'Común' : 'Common'),
            'images' => [
                'small' => $image . '/low.webp',
                'large' => $image . '/high.webp'
            ],
            'abilities' => [],
            'attacks' => []
        ];

        // Map abilities
        if (isset($details['abilities']) && is_array($details['abilities'])) {
            foreach ($details['abilities'] as $ab) {
                $mapped['abilities'][] = [
                    'name' => $ab['name'] ?? '',
                    'text' => $ab['effect'] ?? '',
                    'type' => $ab['type'] ?? 'Ability'
                ];
            }
        }

        // Map attacks
        if (isset($details['attacks']) && is_array($details['attacks'])) {
            foreach ($details['attacks'] as $at) {
                $mapped['attacks'][] = [
                    'name' => $at['name'] ?? '',
                    'text' => $at['effect'] ?? '',
                    'damage' => $at['damage'] ?? '',
                    'cost' => $at['cost'] ?? []
                ];
            }
        }

        // Add additional detailed fields
        if ($details) {
            $mapped['illustrator'] = $details['illustrator'] ?? null;
            $mapped['hp'] = $details['hp'] ?? null;
            $mapped['types'] = $details['types'] ?? [];
            $mapped['stage'] = $details['stage'] ?? null;
            $mapped['retreat'] = $details['retreat'] ?? null;
        }

        return $mapped;
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
            $this->ensureDetailedCard($card);
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
