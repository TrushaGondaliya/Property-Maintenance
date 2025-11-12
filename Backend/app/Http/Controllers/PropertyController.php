<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PropertyController extends Controller
{
    public function list()
    {
        $property = Property::all();
        return response()->json([
            'success' => true,
            'data' => $property
        ]);
    }
    public function store(Request $request)
    {
        // Step 1: Create a validator instance manually
        $validator = Validator::make($request->all(), [
            'address' => 'required',
        ]);

        // Step 2: Handle failed validation
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }
        $data = $request->all();
        $property = new Property();
        $property->name = $data['name'] ?? "";
        $property->description = $data['description'] ?? "";
        $property->address = $data['address'] ?? "";
        $property->created_by = auth()->user()->id;
        $property->save();

        return response()->json([
            'success' => true,
            'data' => $property,
        ]);
    }
    public function update(Request $request)
    {
        // Step 1: Create a validator instance manually
        $validator = Validator::make($request->all(), [
            'address' => 'required',
            'id' => 'required'
        ]);

        // Step 2: Handle failed validation
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }
        $data = $request->all();
        $property = Property::find($data['id']);
        $property->name = $data['name'] ?? "";
        $property->description = $data['description'] ?? "";
        $property->address = $data['address'] ?? "";
        $property->updated_by = auth()->user()->id;
        $property->save();

        return response()->json([
            'success' => true,
            'data' => $property,
        ]);
    }public function delete(Request $request)
    {
        // Step 1: Create a validator instance manually
        $validator = Validator::make($request->all(), [
            'id' => 'required'
        ]);

        // Step 2: Handle failed validation
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }
        $data = $request->all();
        $property = Property::find($data['id']);
        $property->deleted_by = auth()->user()->id;
        $property->save();
        $property->delete();

        return response()->json([
            'success' => true,
        ]);
    }

}
