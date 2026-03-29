<?php
// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set JSON response header
header('Content-Type: application/json');

// ==================== DATABASE CONFIGURATION ====================
// Load from .env or use defaults
$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASS') ?: '';
$dbName = getenv('DB_NAME') ?: 'polynotice';

// ==================== HELPER FUNCTIONS ====================

/**
 * Send JSON response
 */
function jsonResponse($success, $message, $data = []) {
  http_response_code($success ? 200 : 400);
  echo json_encode(array_merge([
    'success' => $success,
    'message' => $message,
    'timestamp' => date('Y-m-d H:i:s')
  ], $data));
  exit;
}

/**
 * Validate email
 */
function isValidEmail($email) {
  return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Sanitize input
 */
function sanitizeEmail($email) {
  return strtolower(trim($email));
}

// ==================== REQUEST VALIDATION ====================

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  jsonResponse(false, 'Invalid request method');
}

// Get email from POST
$email = isset($_POST['email']) ? sanitizeEmail($_POST['email']) : '';

// Validate email
if (empty($email)) {
  jsonResponse(false, 'Email address is required');
}

if (!isValidEmail($email)) {
  jsonResponse(false, 'Please enter a valid email address');
}

// ==================== DATABASE CONNECTION ====================

try {
  $conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

  // Check connection
  if ($conn->connect_error) {
    throw new Exception('Database connection failed: ' . $conn->connect_error);
  }

  // Set charset to utf8
  $conn->set_charset('utf8mb4');

  // ==================== CHECK FOR EXISTING EMAIL ====================

  $checkStmt = $conn->prepare('SELECT id FROM waitlist WHERE email = ? LIMIT 1');
  if (!$checkStmt) {
    throw new Exception('Prepare failed: ' . $conn->error);
  }

  $checkStmt->bind_param('s', $email);
  
  if (!$checkStmt->execute()) {
    throw new Exception('Execute failed: ' . $checkStmt->error);
  }

  $result = $checkStmt->get_result();
  
  if ($result->num_rows > 0) {
    $checkStmt->close();
    $conn->close();
    jsonResponse(false, 'This email is already on the waitlist');
  }

  $checkStmt->close();

  // ==================== INSERT EMAIL ====================

  $insertStmt = $conn->prepare('INSERT INTO waitlist (email, ip_address, user_agent, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())');
  
  if (!$insertStmt) {
    throw new Exception('Prepare failed: ' . $conn->error);
  }

  $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
  $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

  $insertStmt->bind_param('sss', $email, $ipAddress, $userAgent);

  if (!$insertStmt->execute()) {
    throw new Exception('Failed to add to waitlist: ' . $insertStmt->error);
  }

  $newId = $insertStmt->insert_id;
  $insertStmt->close();
  $conn->close();

  // ==================== SUCCESS ====================

  // Optional: Send confirmation email
  sendConfirmationEmail($email);

  jsonResponse(true, 'Successfully added to waitlist', [
    'id' => $newId,
    'email' => $email
  ]);

} catch (Exception $e) {
  // Log error (in production, log to file, not displayed)
  error_log('Waitlist error: ' . $e->getMessage());
  jsonResponse(false, 'An error occurred. Please try again later or contact polynotice@gmail.com');
}

// ==================== HELPER: SEND CONFIRMATION EMAIL ====================

function sendConfirmationEmail($email) {
  // Optional: Implement email sending
  // Example using mail() or PHPMailer
  
  $subject = 'Welcome to PolyNotice Waitlist!';
  $message = "Thank you for joining the PolyNotice waitlist!\n\n";
  $message .= "We're building the next generation of trading intelligence.\n";
  $message .= "Stay tuned for updates!\n\n";
  $message .= "Questions? Email us at polynotice@gmail.com\n";
  
  $headers = "From: polynotice@gmail.com\r\n";
  $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
  
  // Uncomment to enable email sending
  // mail($email, $subject, $message, $headers);
}

// Handle uncaught exceptions
set_exception_handler(function($exception) {
  error_log('Uncaught exception: ' . $exception->getMessage());
  jsonResponse(false, 'An unexpected error occurred');
});
