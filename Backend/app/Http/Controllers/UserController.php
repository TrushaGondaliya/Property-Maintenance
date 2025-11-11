<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function register(Request $request)
    {
        DB::beginTransaction();
        try {
            // Step 1: Create a validator instance manually
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:100',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:6',
                'role_id' => 'required|in:1,2'
            ]);

            // Step 2: Handle failed validation
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Step 3: Validation passed — get data
            $data = $validator->validated();
            $user = new User();
            $user->name = $data['name'];
            $user->email = $data['email'];
            $user->password = Hash::make($data['password']);
            $user->role = $data['role_id'];
            $user->save();
            $token = $user->createToken('api-token')->plainTextToken;

            // Commit if everything is successful
            DB::commit();

            // Step 4: Return success response
            return response()->json([
                'success' => true,
                'message' => "User registered successfully!",
                "auth-token" => $token
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'errors' => $th->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            // Step 1: Create a validator instance manually
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|min:6'
            ]);

            // Step 2: Handle failed validation
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Step 3: Validation passed — get data
            $data = $validator->validated();
            $user = User::where('email', $data['email'])->first();
            if(!$user) {
                 return response()->json([
                    'success' => false,
                    'errors' => 'User not found',
                ], 404);
            }

            if ($user && !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'errors' => 'Credentials do not match',
                ], 402);
            } 
            $token = $user->createToken('api-token')->plainTextToken;

            // Step 4: Return success response
            return response()->json([
                'success' => true,
                'message' => "User Login successfully!",
                'auth-token' => $token,
                'data' => $user
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'errors' => $th->getMessage(),
            ], 500);
        }
    }
}
