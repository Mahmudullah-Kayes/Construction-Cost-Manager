<?php

namespace App\Http\Controllers;

use App\Models\TilesLabor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TilesLaborController extends Controller
{
    /**
     * Get all tiles labor entries
     */
    public function index(): JsonResponse
    {
        $tilesLabor = TilesLabor::orderBy('date', 'desc')->get();
        return response()->json($tilesLabor);
    }

    /**
     * Store a new tiles labor entry
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'paid_amount' => 'required|numeric|min:0',
        ]);

        $tilesLabor = TilesLabor::create($validated);

        return response()->json($tilesLabor, 201);
    }

    /**
     * Update a tiles labor entry
     */
    public function update(Request $request, TilesLabor $tilesLabor): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'paid_amount' => 'required|numeric|min:0',
        ]);

        $tilesLabor->update($validated);

        return response()->json($tilesLabor);
    }

    /**
     * Delete a tiles labor entry
     */
    public function destroy(TilesLabor $tilesLabor): JsonResponse
    {
        $tilesLabor->delete();

        return response()->json(['message' => 'Tiles labor entry deleted successfully']);
    }
}
