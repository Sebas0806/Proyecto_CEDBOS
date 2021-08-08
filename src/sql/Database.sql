-- CREACION DE BASE DE DATOS CEDBOS --
CREATE DATABASE CEDBOS;
USE CEDBOS;
CREATE TABLE Grupos (
  IdGrupo INT PRIMARY KEY NOT NULL,
  Nombre VARCHAR(40) NOT NULL
);
CREATE TABLE Integrantes (
  NIP INT PRIMARY KEY NOT NULL,
  IdGrupo INT NOT NULL,
  td CHAR(2) NOT NULL,
  NombreCompleto VARCHAR(60) NOT NULL,
  barrio VARCHAR(60) NOT NULL,
  municipio VARCHAR(60) NOT NULL,
  direccion VARCHAR(100) NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  celular VARCHAR(30) NOT NULL,
  email VARCHAR(100) NOT NULL,
  nacimiento DATE NOT NULL,
  sexo CHAR(1) NOT NULL,
  CondicionUsuario BOOLEAN NOT NULL,
  EstadoMiembro BOOLEAN NOT NULL,
  CONSTRAINT fk_integrantes FOREIGN KEY (IdGrupo) REFERENCES Grupos (IdGrupo) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE Users(
  NIP INT PRIMARY KEY NOT NULL,
  User VARCHAR(50) NOT NULL,
  Pass VARCHAR(200),
  Question VARCHAR(255) NOT NULL,
  Answer VARCHAR(255) NOT NULL,
  SuperUser BOOLEAN NOT NULL,
  FOREIGN KEY (NIP) REFERENCES Integrantes (NIP) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE Mercados(
  IdMer INT PRIMARY KEY NOT NULL,
  IdGrupo INT NOT NULL,
  Entregado BOOLEAN NOT NULL,
  CONSTRAINT fk_mercados FOREIGN KEY (IdGrupo) REFERENCES grupos (IdGrupo) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE Grados (
  IdGrado INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Grado VARCHAR(40) NOT NULL,
  CantidadProductos INT NOT NULL,
  AporteTotal INT NOT NULL
);
CREATE TABLE AportesMonetarios (
  IdAporte INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  IdGrado INT NOT NULL,
  Dinero INT NOT NULL,
  Mes VARCHAR(40),
  CONSTRAINT fk_dinero FOREIGN KEY (IdGrado) REFERENCES Grados (IdGrado) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE Productos (
  IdProducto INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  IdMer INT,
  IdGrado INT NOT NULL,
  NombreProducto VARCHAR(40) NOT NULL,
  Tipo VARCHAR(40) NOT NULL,
  Marca VARCHAR(40) NOT NULL,
  Disponible BOOLEAN NOT NULL,
  CONSTRAINT fk_productos FOREIGN KEY (IdMer) REFERENCES Mercados (IdMer) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_grados FOREIGN KEY (IdGrado) REFERENCES Grados (IdGrado) ON DELETE CASCADE ON UPDATE CASCADE
);
-- GROUP CREATION --
INSERT INTO
  Grupos(IdGrupo, Nombre)
VALUES
  (1, 'Grupo Juvenil');
--SUPERUSER CREATION--
INSERT INTO
  Integrantes(
    NIP,
    IdGrupo,
    td,
    NombreCompleto,
    barrio,
    municipio,
    direccion,
    telefono,
    celular,
    email,
    nacimiento,
    sexo,
    CondicionUsuario,
    EstadoMiembro
  )
VALUES
  (
    1,
    1,
    'AD',
    'ADMIN',
    'ADMIN',
    'ADMIN',
    'ADMIN',
    'ADMIN',
    'ADMIN',
    'ADMIN',
    '2021-06-29',
    'B',
    1,
    1
  );
INSERT INTO
  users(NIP, User, Pass, Question, Answer, SuperUser)
VALUES
  (
    1,
    'ADMIN',
    '$2a$08$uoY9S9WUHSQHX.qkNkcneeC1.iD31CeIqe5.rrhNI2/I2QZKWrHJ6',
    'ADMIN',
    '$2a$08$uoY9S9WUHSQHX.qkNkcneeC1.iD31CeIqe5.rrhNI2/I2QZKWrHJ6',
    1
  );