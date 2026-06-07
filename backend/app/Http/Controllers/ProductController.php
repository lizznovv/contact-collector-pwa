<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{

    public function index()
    {
        $products = Product::all();
        return response()->json(['products' => $products]);
    }


    public function store(ProductRequest $request)
    {
        $validated = $request->validated();

        try {
            $product = Product::create($validated);

            AuditLogger::log(
                'CREATE_PRODUCT',
                entityType: 'Product',
                entityId: $product->id,
            );
        }
        catch (\Exception $exception) {
            AuditLogger::log('CREATE_PRODUCT', 'error', errorMessage: $exception->getMessage());

            return response()->json([
                'message' => 'Ошибка добавления продукта.'
            ], 500);
        }

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }


    public function show($id)
    {
        $product = Product::findOrFail($id);

        return response()->json(['product' => $product]);
    }

    public function update(ProductRequest $request, $id)
    {
        $validated = $request->validated();
        $product = Product::findOrFail($id);
        $old = $product->only(['name', 'category', 'is_active',]);
        $product->update($validated);

        AuditLogger::log(
            'UPDATE_PRODUCT',
            entityType: 'Product',
            entityId: $product->id,
            payload: [
                'before' => $old,
                'after'  => $product->only(['name', 'category', 'is_active',]),
            ]
        );

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }


    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        AuditLogger::log(
            'DELETE_PRODUCT',
            entityType: 'Product',
            entityId: $product->id,
        );

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}
