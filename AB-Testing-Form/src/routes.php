<?php

use Slim\Http\Request;
use Slim\Http\Response;

require 'vendor/autoload.php';

use SMTPValidateEmail\Validator as SmtpEmailValidator;

// Routes

$app->get('/', function (Request $request, Response $response, array $args) {	
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");
    
    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});

$app->post('/postForm', function ($request, $response, $args) {
    // get the data from the form
    $data = $request->getParsedBody();

    $stmt = $this->db->prepare("INSERT INTO `Responses` VALUES (:email, :response)");
	
	$stmt->bindValue(':email',$data["email"],PDO::PARAM_STR);
	$stmt->bindValue(':response',json_encode($data),PDO::PARAM_STR);

	try{
		$stmt->execute();
	}
	catch(PDOException $e){
		print($e);
		return $this->response->withStatus(400);
		// return $this->renderer->render($response, 'thankyou.phtml', $args);
	}
	
    return $this->renderer->render($response, 'thankyou.phtml', $args);
});

// Adapted from: https://github.com/zytzagoo/smtp-validate-email
$app->post('/validateEmail', function ($request, $response, $args) { 
	include('secret_key.php');

	$data = $request->getParsedBody();

	$captcha_data = [
	    'secret' => $secret_key,
	    'response' => $data[recaptcha]
	];

	$ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $captcha_data);

	// check google to see if user is valid
	$response = curl_exec($ch);

	// close the connection, release resources used
	curl_close($ch);

	$results = "false";

	// user is valid
	if ($response["success"] == true) {
		
		// verify email
		$email = $data[email];

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