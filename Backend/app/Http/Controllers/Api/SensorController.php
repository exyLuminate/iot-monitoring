<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SensorLog;
use Illuminate\Http\Request;

class SensorController extends Controller
{
    // Endpoint GET: Dipanggil oleh React PWA untuk menampilkan data
    public function index()
    {
        // Mengambil 50 data terbaru agar grafik tidak terlalu berat
        $data = SensorLog::latest()->take(50)->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Data sensor berhasil diambil',
            'data' => $data
        ]);
    }

    // Endpoint POST: Ditembak oleh ESP8266 setiap beberapa detik
    public function store(Request $request)
    {
        // 1. Validasi tipe data yang masuk
        $request->validate([
            'light_level' => 'required|integer',
            'sound_level' => 'required|integer',
        ]);

        // 2. Logika penentuan status yang lebih dinamis (Menangani Edge Case)
        $issues = []; 

        if ($request->sound_level == 1) {
            $issues[] = "Bising";
        }
        if ($request->light_level < 300) { 
            $issues[] = "Gelap";
        }

        // Jika array kosong, berarti kondusif. Jika ada isinya, gabungkan kata.
        if (empty($issues)) {
            $status = "Kondusif";
        } else {
            $status = "Terlalu " . implode(" & ", $issues); 
        }

        // 3. Simpan data langsung ke MySQL di hosting
        $log = SensorLog::create([
            'light_level' => $request->light_level,
            'sound_level' => $request->sound_level,
            'environment_status' => $status
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil disimpan',
            'data' => $log
        ], 201);
    }
}