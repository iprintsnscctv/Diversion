<?php
/**
 * Backend Proxy for Google Gemini AI & Hostinger public_html
 * Diversion Vigan Transient Hotel App
 */

// 1. Set Response Headers & CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Load Gemini API Key
// Recommended: Set in your server environment or .env file, or paste securely below
$GEMINI_API_KEY = getenv('GEMINI_API_KEY') ?: getenv('VITE_GEMINI_API_KEY') ?: 'YOUR_GEMINI_API_KEY_HERE';

// 3. Simple Health / Info check
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        "status" => "healthy",
        "service" => "Diversion Vigan Transient PHP Backend",
        "timestamp" => date("c")
    ]);
    exit();
}

// 4. Handle POST Requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $inputData = json_decode($rawInput, true);

    if (!$inputData) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON payload."]);
        exit();
    }

    $action = isset($inputData['action']) ? $inputData['action'] : 'ask_gemini';

    // Action: Call Gemini AI
    if ($action === 'ask_gemini' || isset($inputData['prompt'])) {
        $prompt = isset($inputData['prompt']) ? trim($inputData['prompt']) : '';

        if (empty($prompt)) {
            http_response_code(400);
            echo json_encode(["error" => "Prompt cannot be empty."]);
            exit();
        }

        if ($GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            echo json_encode([
                "reply" => "Gemini API key is not configured in backend.php yet. Please edit backend.php in your Hostinger File Manager to insert your Gemini API Key.",
                "configured" => false
            ]);
            exit();
        }

        // Hotel System Context
        $systemInstruction = "You are the virtual concierge for 'Diversion Vigan Transient' located on Diversion Road, Vigan City, Ilocos Sur. You help guests with room information, rates in Philippine Pesos (PHP), capacities, proximity to Calle Crisologo (5-8 mins), check-in (2:00 PM) and check-out (12:00 PM). Be warm, hospitable, and concise.";

        $geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . urlencode($GEMINI_API_KEY);

        $payload = [
            "contents" => [
                [
                    "role" => "user",
                    "parts" => [
                        ["text" => $systemInstruction . "\n\nGuest Query: " . $prompt]
                    ]
                ]
            ]
        ];

        // Execute cURL request to Google Gemini API
        $ch = curl_init($geminiUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/json"
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            http_response_code(500);
            echo json_encode(["error" => "cURL Error: " . $curlError]);
            exit();
        }

        if ($httpCode >= 200 && $httpCode < 300) {
            $responseData = json_decode($response, true);
            $replyText = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? "Thank you for reaching out to Diversion Vigan Transient. How else may we assist your stay?";
            echo json_encode([
                "reply" => $replyText,
                "status" => "success"
            ]);
        } else {
            http_response_code($httpCode);
            echo json_encode([
                "error" => "Gemini API returned status " . $httpCode,
                "details" => json_decode($response, true)
            ]);
        }
        exit();
    }

    http_response_code(404);
    echo json_encode(["error" => "Action not recognized."]);
    exit();
}
