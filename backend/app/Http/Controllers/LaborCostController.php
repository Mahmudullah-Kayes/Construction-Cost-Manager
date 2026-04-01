<?php

namespace App\Http\Controllers;

use App\Models\LaborCost;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LaborCostController extends Controller
{
    /**
     * Get all labor costs
     */
    public function index(): JsonResponse
    {
        $laborCosts = LaborCost::orderBy('date', 'desc')->get();
        return response()->json($laborCosts);
    }

    /**
     * Store a new labor cost
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'note' => 'nullable|string',
        ]);

        $laborCost = LaborCost::create($validated);

        return response()->json($laborCost, 201);
    }

    /**
     * Update a labor cost
     */
    public function update(Request $request, LaborCost $laborCost): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'note' => 'nullable|string',
        ]);

        $laborCost->update($validated);

        return response()->json($laborCost);
    }

    /**
     * Delete a labor cost
     */
    public function destroy(LaborCost $laborCost): JsonResponse
    {
        $laborCost->delete();

        return response()->json(['message' => 'Labor cost deleted successfully']);
    }
}
