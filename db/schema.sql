DROP DATABASE IF EXISTS namesdb;
CREATE DATABASE namesdb;
USE namesdb;

USE namesdb;
CREATE TABLE names
(
    id int NOT NULL
    AUTO_INCREMENT,
	userId int NOT NULL,
    name varchar
    (255) NOT NULL,
	gender boolean DEFAULT NULL,
    searchTerm varchar
    (255) NOT NULL,
	PRIMARY KEY
    (id)
);


    CREATE TABLE users
    (
        id int not null
        AUTO_INCREMENT,
    name varchar
        (255) not null,
    password varchar
        (255) not null,
    PRIMARY KEY
        (id)
);
