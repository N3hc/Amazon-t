<?php

namespace App\Traits;

trait ApiResponse
{
    /**
     * Return a success JSON response.
     *
     * @param  mixed  $data
     * @param  int  $code
     * @return \Illuminate\Http\JsonResponse
     */
    protected function successResponse($data, $code = 200)
    {
        return response()->json($data, $code);
    }

    /**
     * Return an error JSON response.
     *
     * @param  string  $message
     * @param  int  $code
     * @return \Illuminate\Http\JsonResponse
     */
    protected function errorResponse($message, $code = 404)
    {
        return response()->json([
            'message' => $message
        ], $code);
    }
}
