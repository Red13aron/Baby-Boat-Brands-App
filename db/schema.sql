DROP DATABASE IF EXISTS namesdb;
CREATE DATABASE namesdb;
USE namesdb;

DROP TABLE IF EXISTS names;
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

DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    id int not null AUTO_INCREMENT,
    name varchar(255) not null,
    password varchar(255) not null,
    createdAt DATE null,
    updatedAt DATE null,
    PRIMARY KEY (id)
);