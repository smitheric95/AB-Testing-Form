<?php

use Slim\Http\Request;
use Slim\Http\Response;

require 'vendor/autoload.php';
use SMTPValidateEmail\Validator as SmtpEmailValidator;

// Routes

$app->get('/', function (Request $request, Response $response, array $args) {
	// TODO: Get random color scheme, apply to template
	
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});

$app->post('/postForm', function ($request, $response, $args) {
    // get the data from the form
    $data = $request->getParsedBody();

    echo "<pre>";var_dump($data);echo "</pre>";

    return $this->renderer->render($response, 'thankyou.phtml', $args);
});

// Adapted from: https://github.com/zytzagoo/smtp-validate-email
$app->post('/validateEmail', function ($request, $response, $args) { 
	$data = $request->getParsedBody();
	

	$email     = $data[email];
	$sender    = $data[email];
	$validator = new SmtpEmailValidator($email, $sender);
	
	// If debug mode is turned on, logged data is printed as it happens:
	$validator->debug = true;

	$results   = $validator->validate();
	
	return json_encode($results[$email]);
});

