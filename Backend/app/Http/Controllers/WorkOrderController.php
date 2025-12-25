<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WorkOrderController extends Controller
{
    public function getWorkOrders()
    {
        if (auth()->user()->role === '1') {
            $workOrder = WorkOrder::with(['property', 'user'])->where('user_id', auth()->user()->id)->get();
        } else {
            $workOrder = WorkOrder::with(['property', 'user'])->whereRaw('FIND_IN_SET(?, technician_id)', [auth()->user()->id])->get();
        }
        $workOrder = $workOrder->map(function ($wo) {
            $ids = explode(',', $wo->technician_id);
            $wo->technicians = User::whereIn('id', $ids)->get();
            $wo->status_text = $wo->status_text;
            return $wo;
        });
        $users = User::where('role', 2)->get();
        return response()->json([
            'success' => true,
            'data' => $workOrder,
            'users' => $users
        ]);
    }
    public function storeWorkOrder(Request $request)
    {
        if (auth()->user()->role === '2') {
            return response()->json([
                'success' => false,
                'custom_error' => 'You can`t add work order as you are technician user.',
            ], 422);
        }
        // Step 1: Create a validator instance manually
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'property_id' => 'required|exists:properties,id,deleted_at,NULL',
            'technician_id.*' => 'exists:users,id',
            'status' => 'nullable|in:pending,in_progress,completed',
        ]);

        // Step 2: Handle failed validation
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'custom_error' => 'Please fill required data'
            ], 422);
        }
        $data = $request->all();
        $workOrder = new WorkOrder();
        $workOrder->title = $data['title'] ?? "";
        $workOrder->description = $data['description'] ?? "";
        $workOrder->property_id = $data['property_id'] ?? "";
        $workOrder->technician_id = implode(',',  $data['technician_id']) ?? "";
        $workOrder->status = $data['status'] ?? "pending";
        $workOrder->user_id = auth()->user()->id;
        $workOrder->created_by = auth()->user()->id;
        $workOrder->save();

        return response()->json([
            'success' => true,
            'message' => "workOrder saved successfully!",
            'data' => $workOrder,
        ]);
    }
    public function updateWorkOrder(Request $request)
    {
        if (auth()->user()->role === '2') {
            return response()->json([
                'success' => false,
                'custom_error' => 'You can`t update work order as you are technician user.',
            ], 422);
        }
        // Step 1: Create a validator instance manually
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'title' => 'required|string|max:255',
            'property_id' => 'required|exists:properties,id,deleted_at,NULL',
            'technician_id.*' => 'exists:users,id',
            'status' => 'nullable|in:pending,in_progress,completed',
        ]);

        // Step 2: Handle failed validation
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'custom_error' => 'Please fill required data'
            ], 422);
        }
        $data = $request->all();
        $workOrder = WorkOrder::where('id', $data['id'])->where('user_id', auth()->id())->first();
        if (!$workOrder) {
            return response()->json([
                'success' => false,
                'custom_error' => 'Work order not found',
            ], 404);
        }
        $workOrder->title = $data['title'] ?? "";
        $workOrder->description = $data['description'] ?? "";
        $workOrder->property_id = $data['property_id'] ?? "";
        $workOrder->technician_id = implode(',', $data['technician_id']) ?? "";
        $workOrder->status = $data['status'] ?? "pending";
        $workOrder->user_id = auth()->user()->id;
        $workOrder->updated_by = auth()->user()->id;
        $workOrder->save();
        $users = User::where('role', 2)->get();

        return response()->json([
            'success' => true,
            'users' => $users
        ]);
    }
    public function deleteWorkOrder(Request $request)
    {
        if (auth()->user()->role === '2') {
            return response()->json([
                'success' => false,
                'custom_error' => 'You can`t delete work order as you are technician user.',
            ], 422);
        }
        // Step 1: Create a validator instance manually
        $validator = Validator::make($request->all(), [
            'id' => 'required'
        ]);

        // Step 2: Handle failed validation
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'custom_error' => 'Please fill required data'
            ], 422);
        }
        $data = $request->all();
        $workOrder = WorkOrder::find($data['id']);
        if (!$workOrder) {
            return response()->json([
                'success' => false,
                'custom_error' => 'Work order not found',
            ], 404);
        }
        $workOrder->deleted_by = auth()->user()->id;
        $workOrder->save();
        $workOrder->delete();

        if (auth()->user()->role === '1') {
            $workOrder = WorkOrder::with('property')->with('user')->where('user_id', auth()->user()->id)->get();
        } else {
            $workOrder = WorkOrder::with('property')->with('user')->whereRaw('FIND_IN_SET(?, technician_id)', [auth()->user()->id])->get();
        }
        $workOrder = $workOrder->map(function ($wo) {
            $ids = explode(',', $wo->technician_id);
            $wo->technicians = User::whereIn('id', $ids)->get();
            return $wo;
        });
        $users = User::where('role', 2)->get();


        return response()->json([
            'success' => true,
            'data' => $workOrder,
            'users' => $users
        ]);
    }
    public function updateWorkOrderStatus(Request $request)
    {
        // Step 1: Create a validator instance manually
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        // Step 2: Handle failed validation
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'custom_error' => 'Please fill required data'
            ], 422);
        }
        $data = $request->all();
        $workOrder = WorkOrder::where('id', $data['id'])->whereRaw('FIND_IN_SET(?, technician_id)', [auth()->user()->id])->first();
        if (!$workOrder) {
            return response()->json([
                'success' => false,
                'custom_error' => 'Work order not found',
            ], 404);
        }
        $workOrder->status = $data['status'] ?? "pending";
        $workOrder->updated_by = auth()->user()->id;
        $workOrder->save();

        return response()->json([
            'success' => true,
            'message' => "workOrder status updated successfully!",
        ]);
    }
}
