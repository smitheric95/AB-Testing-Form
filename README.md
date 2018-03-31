# A/B Testing Form for CSE 8316

TODO:
- block more than 5 invalid attempts
- check for smu email only - in php regex
	- still buggy - test on vagrant
- check to see if email has been used
- buy .com domain
- sanitize input for email and post form
- show page even with invalid response
- add captcha

commands:
- sass --watch sass/:css/
- composer require zytzagoo/smtp-validate-email --update-no-dev 


DB:

Responses:
	email, theme, time, response (json)
