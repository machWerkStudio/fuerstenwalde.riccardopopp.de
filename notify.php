<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed']);
    exit;
}

$honeypot = trim((string)($_POST['website'] ?? ''));
if ($honeypot !== '') {
    echo json_encode(['ok' => true, 'message' => 'Du wirst benachrichtigt, sobald die App verfügbar ist.']);
    exit;
}

$email = trim((string)($_POST['email'] ?? ''));

if ($email === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Bitte eine E-Mail-Adresse eingeben.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Bitte eine gültige E-Mail-Adresse eingeben.']);
    exit;
}

$email = preg_replace('/[\r\n]+/', '', $email);

$to = 'anfrage@mein-fw.de';
$subject = 'Launch-Benachrichtigung - Fuerstenwalde App';
$body = "Neue Launch-Benachrichtigungs-Eintragung\n\n";
$body .= "E-Mail: {$email}\n";
$body .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unbekannt') . "\n";
$body .= "Zeit: " . date('Y-m-d H:i:s') . "\n";

$headers = [
    'From: Mein Fürstenwalde App <info@mein-fw.de>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($to, $subject, $body, implode("\r\n", $headers), '-f info@mein-fw.de');

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Eintragung fehlgeschlagen. Bitte versuche es erneut.']);
    exit;
}

echo json_encode(['ok' => true, 'message' => 'Du wirst benachrichtigt, sobald die App verfügbar ist.']);
