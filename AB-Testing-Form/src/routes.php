<?php

use Slim\Http\Request;
use Slim\Http\Response;

require 'vendor/autoload.php';

use SMTPValidateEmail\Validator as SmtpEmailValidator;

// helper function: https://stackoverflow.com/a/834355
function endsWith($haystack, $needle) {
    $length = strlen($needle);

    return $length === 0 || 
    (substr($haystack, -$length) === $needle);
}

// Routes
$app->get('/', function (Request $request, Response $response, array $args) {	
    // Sample log message
    // $this->logger->info("Slim-Skeleton '/' route");
    
    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});

$app->post('/postForm', function ($request, $response, $args) {
    // get the data from the form
    $data = $request->getParsedBody();
    $email = $data["email"];

    // remove recaptcha response
    unset($data['g-recaptcha-response']);


    // check to make sure email hasn't been used
	$stmt = $this->db->prepare("SELECT email FROM Responses WHERE email = :email");
	$stmt->bindValue(':email', $email, PDO::PARAM_INT);

	try {
		$stmt->execute();
	}
	catch(PDOException $e) {
		return $this->response->withStatus(400);
	}

	// email wasn't found, post form
	if (count($stmt->fetchAll()) == 0) {

	    $stmt = $this->db->prepare("INSERT INTO `Responses` VALUES (:email, :response)");
		
		$stmt->bindValue(':email',$email,PDO::PARAM_STR);
		$stmt->bindValue(':response',json_encode($data),PDO::PARAM_STR);

		try{
			$stmt->execute();
		}
		catch(PDOException $e){
			// print($e);
			// return $this->response->withStatus(400);
			return $this->renderer->render($response, 'thankyou.phtml', $args);
		}
	}

    return $this->renderer->render($response, 'thankyou.phtml', $args);
});

// Adapted from: https://github.com/zytzagoo/smtp-validate-email
$app->post('/validateEmail', function ($request, $response, $args) { 
	include('secret_key.php');

	$data = $request->getParsedBody();

	$url = 'https://www.google.com/recaptcha/api/siteverify';

	$captcha_data = [
	    'secret' => $secret_key,
	    'response' => $data[recaptcha]
	];

	$options = array(
		'http' => array (
			'method' => 'POST',
			'content' => http_build_query($captcha_data)
		)
	);

	$context  = stream_context_create($options);
	$verify = file_get_contents($url, false, $context);
	$captcha_response = json_decode($verify);

	$results = "false";
	
	$email = $data[email];

	// user and email are valid
	if (($captcha_response->success == true) && filter_var($email, FILTER_VALIDATE_EMAIL) 
		&& (endsWith($email, "@smu.edu") || endsWith($email, "@mail.smu.edu")) ) {

		// verify email
		$stmt = $this->db->prepare("SELECT email FROM Responses WHERE email = :email");
		$stmt->bindValue(':email', $email, PDO::PARAM_INT);

		try {
			$stmt->execute();
		}
		catch(PDOException $e) {
			return $this->response->withStatus(400);
		}

		// email wasn't found, validate
		if (count($stmt->fetchAll()) == 0) {
			$sender = $data[email];
			$validator = new SmtpEmailValidator($email, $sender);
			
			// If debug mode is turned on, logged data is printed as it happens:
			// $validator->debug = true;

			$results = $validator->validate();
			$results = json_encode($results[$email]);
		}
	}

	return $results;
});