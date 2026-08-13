<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityLog;

class ActivityLogsController extends Controller
{
    //
    /**
     * Display a listing of the activity logs.
     */
    public function index()
    {
        // Fetch all logs, latest first
        $logs = ActivityLog::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }
}
