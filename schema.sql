CREATE DATABASE `AB-Testing-Form`;

USE `AB-Testing-Form`;

CREATE TABLE Responses (email VARCHAR(100), response VARCHAR(500));

CREATE USER 'api'@'localhost' IDENTIFIED BY 'password';
GRANT SELECT ON `AB-Testing-Form`.* TO 'api'@'localhost';
GRANT UPDATE ON `AB-Testing-Form`.* TO 'api'@'localhost';
GRANT INSERT ON `AB-Testing-Form`.* TO 'api'@'localhost';
GRANT DELETE ON `AB-Testing-Form`.* TO 'api'@'localhost';
