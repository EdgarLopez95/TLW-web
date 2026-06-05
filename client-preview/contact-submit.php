<?php

declare(strict_types=1);

require_once __DIR__ . '/server/ContactFormLogger.php';
require_once __DIR__ . '/server/ContactFormService.php';

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'status' => 'method_not_allowed',
        'message' => 'Use POST to submit the contact form.',
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

$configPath = __DIR__ . '/config/contact-mailer.config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'status' => 'setup',
        'message' => 'The contact form is still being set up. Please email us directly for now.',
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$rawBody = file_get_contents('php://input');
$payload = $_POST;

if (stripos($contentType, 'application/json') !== false) {
    $decoded = json_decode($rawBody ?: '', true);
    if (!is_array($decoded)) {
        http_response_code(400);
        echo json_encode([
            'ok' => false,
            'status' => 'invalid_payload',
            'message' => 'The request payload was not valid JSON.',
        ], JSON_UNESCAPED_SLASHES);
        exit;
    }

    $payload = $decoded;
}

$config = require $configPath;
$logger = new ContactFormLogger();
$service = new ContactFormService($config, $logger);
$result = $service->handle($payload, $_SERVER);

$httpCode = (int) ($result['httpCode'] ?? 200);
unset($result['httpCode']);

http_response_code($httpCode);
echo json_encode($result, JSON_UNESCAPED_SLASHES);
