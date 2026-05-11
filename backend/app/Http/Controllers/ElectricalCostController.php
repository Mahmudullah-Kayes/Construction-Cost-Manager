<?php

namespace App\Http\Controllers;

use App\Models\ElectricalCost;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ElectricalCostController extends Controller
{
    /**
     * Get all electrical costs
     */
    public function index(): JsonResponse
    {
        $electricalCosts = ElectricalCost::orderBy('date', 'desc')->get();
        return response()->json($electricalCosts);
    }

    /**
     * Store a new electrical cost
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'name' => 'nullable|string|max:255',
            'note' => 'nullable|string',
        ]);

        $electricalCost = ElectricalCost::create($validated);

        return response()->json($electricalCost, 201);
    }

    /**
     * Update an electrical cost
     */
    public function update(Request $request, ElectricalCost $electricalCost): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'name' => 'nullable|string|max:255',
            'note' => 'nullable|string',
        ]);

        $electricalCost->update($validated);

        return response()->json($electricalCost);
    }

    /**
     * Delete an electrical cost
     */
    public function destroy(ElectricalCost $electricalCost): JsonResponse
    {
        $electricalCost->delete();

        return response()->json(['message' => 'Electrical cost deleted successfully']);
    }
}
