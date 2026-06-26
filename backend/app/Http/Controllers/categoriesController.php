<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\categories;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;

class categoriesController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $lang = $request->header('Accept-Language') ?? $request->query('lang') ?? 'en';
        $lang = str_contains(strtolower($lang), 'es') ? 'es' : 'en';

        $allCategories = categories::all();

        if ($allCategories->isEmpty()) {
            return $this->errorResponse('No categories registered', 404);
        }

        foreach ($allCategories as $cat) {
            $names = json_decode($cat->name, true);
            if (is_array($names)) {
                $cat->name = $names[$lang] ?? $names['en'] ?? $cat->name;
            }
        }

        if ($request->id) {
            $category = $allCategories->firstWhere('id', $request->id);
            if (!$category) {
                return $this->errorResponse('Category not found', 404);
            }
            return $this->successResponse($category);
        }

        return $this->successResponse($allCategories);
    }

    public function update(Request $request)
    {
        $card = categories::find($request->id);

        if ($card) {
            if ($request->has('name')) {
                $card->name = $request->name;
            }
            if ($request->has('id_set')) {
                $card->id_set = $request->id_set;
            }
            if ($request->has('release_date')) {
                $card->release_date = Carbon::createFromFormat('d/m/Y', $request->release_date)->format('Y-m-d');
            }
            if ($request->has('total_cards')) {
                $card->total_cards = $request->total_cards;
            }
            if ($request->has('logo')) {
                $card->logo = $request->logo;
            }
            if ($request->has('symbol')) {
                $card->symbol = $request->symbol;
            }
            if ($request->has('legal')) {
                $card->legal = $request->legal;
            }
            if ($request->has('deleted')) {
                $card->deleted = $request->deleted;
            }
            $card->save();

            return $this->successResponse([
                'name' => $card->name,
                'symbol' => $card->symbol,
                'logo' => $card->logo,
                'total_cards' => $card->total_cards,
                'id_set' => $card->id_set,
                'release_date' => $card->release_date,
                'deleted' => $card->deleted
            ]);
        }

        return $this->errorResponse('Category not found', 404);
    }

    public function store(Request $request)
    {
        $card = new categories();

        if ($card) {
            $card->name = $request->name;
            $card->id_set = $request->id_set;
            $card->total_cards = $request->total_cards;
            $card->symbol = $request->symbol;
            $card->logo = $request->logo;
            $card->release_date = Carbon::createFromFormat('d/m/Y', $request->release_date)->format('Y-m-d');

            if ($card->save()) {
                return $this->successResponse([
                    'name' => $card->name,
                    'logo' => $card->logo,
                    'symbol' => $card->symbol,
                    'total_cards' => $card->total_cards,
                    'id_set' => $card->id_set,
                    'release_date' => $card->release_date,
                    'message' => 'Category saved successfully'
                ]);
            } else {
                return $this->errorResponse('Error saving category', 500);
            }
        } else {
            return $this->errorResponse('Category not found', 404);
        }
    }

    public function delete(Request $request)
    {
        $card = categories::find($request->id);

        if ($card) {
            if ($card->delete()) {
                return $this->successResponse([
                    'message' => 'Category deleted'
                ]);
            } else {
                return $this->errorResponse('Error deleting category', 500);
            }
        } else {
            return $this->errorResponse('Category not found', 404);
        }
    }
}
