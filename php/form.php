<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

function sanitize($field) {
    return htmlspecialchars(trim($field), ENT_QUOTES, 'UTF-8');
}

$name = sanitize($_POST['name'] ?? '');
$email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$phone = sanitize($_POST['phone'] ?? '');
$message = sanitize($_POST['message'] ?? '');
$consent = isset($_POST['consent']);
$recaptcha = $_POST['g-recaptcha-response'] ?? '';

if (!$name || !$email || !$phone || !$message || !$consent || !$recaptcha) {
    echo json_encode(['success' => false, 'message' => 'Please complete all required fields.']);
    exit;
}

// Verify reCAPTCHA
$secret = 'YOUR_SECRET_KEY'; // TODO: replace with actual secret key
$verify = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secret}&response={$recaptcha}&remoteip=" . $_SERVER['REMOTE_ADDR']);
$responseData = json_decode($verify);

if (!$responseData || !$responseData->success) {
    echo json_encode(['success' => false, 'message' => 'reCAPTCHA verification failed.']);
    exit;
}

// TODO: send email using mail() or a library like PHPMailer
// Example using mail():
// $to = 'info@festivalesnauticos.com';
// $subject = 'Nuevo mensaje de contacto';
// $body = "Nombre: {$name}\nEmail: {$email}\nTeléfono: {$phone}\nMensaje:\n{$message}";
// $headers = 'From: '.$email . "\r\n" . 'Reply-To: '.$email;
// mail($to, $subject, $body, $headers);

echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
