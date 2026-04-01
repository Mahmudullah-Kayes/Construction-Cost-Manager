<?php

namespace App\Http\Controllers;

use App\Models\MiscCost;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MiscCostController extends Controller
{
    /**
     * Get all misc costs
     */
    public function index(): JsonResponse
    {
        $miscCosts = MiscCost::orderBy('created_at', 'desc')->get();
        return response()->json($miscCosts);
    }

    /**
     * Store a new misc cost
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'note' => 'nullable|string',
        ]);

        $miscCost = MiscCost::create($validated);

        return response()->json($miscCost, 201);
    }

    /**
     * Update a misc cost
     */
    public function update(Request $request, MiscCost $miscCost): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'note' => 'nullable|string',
        ]);

        $miscCost->update($validated);

        return response()->json($miscCost);
    }

    /**
     * Delete a misc cost
     */
    public function destroy(MiscCost $miscCost): JsonResponse
    {
        $miscCost->delete();

        return response()->json(['message' => 'Misc cost deleted successfully']);
    }
}
