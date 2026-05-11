<?php

namespace App\Http\Controllers;

use App\Models\PlumbingCost;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PlumbingCostController extends Controller
{
    /**
     * Get all plumbing costs
     */
    public function index(): JsonResponse
    {
        $plumbingCosts = PlumbingCost::orderBy('date', 'desc')->get();
        return response()->json($plumbingCosts);
    }

    /**
     * Store a new plumbing cost
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'name' => 'nullable|string|max:255',
            'note' => 'nullable|string',
        ]);

        $plumbingCost = PlumbingCost::create($validated);

        return response()->json($plumbingCost, 201);
    }

    /**
     * Update a plumbing cost
     */
    public function update(Request $request, PlumbingCost $plumbingCost): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'name' => 'nullable|string|max:255',
            'note' => 'nullable|string',
        ]);

        $plumbingCost->update($validated);

        return response()->json($plumbingCost);
    }

    /**
     * Delete a plumbing cost
     */
    public function destroy(PlumbingCost $plumbingCost): JsonResponse
    {
        $plumbingCost->delete();

        return response()->json(['message' => 'Plumbing cost deleted successfully']);
    }
}
