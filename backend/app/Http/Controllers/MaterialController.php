<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MaterialController extends Controller
{
    /**
     * Get all materials
     */
    public function index(): JsonResponse
    {
        $materials = Material::orderBy('date', 'desc')->get();
        return response()->json($materials);
    }

    /**
     * Store a new material
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'name' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'note' => 'nullable|string',
        ]);

        $material = Material::create($validated);

        return response()->json($material, 201);
    }

    /**
     * Update a material
     */
    public function update(Request $request, Material $material): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'name' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'note' => 'nullable|string',
        ]);

        $material->update($validated);

        return response()->json($material);
    }

    /**
     * Delete a material
     */
    public function destroy(Material $material): JsonResponse
    {
        $material->delete();

        return response()->json(['message' => 'Material deleted successfully']);
    }
}
