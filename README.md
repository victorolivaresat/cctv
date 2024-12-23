# Sistema de Notificación de Cámaras de CCTV

Este proyecto es un sistema que captura las notificaciones de desconexión de video de cámaras de distintas marcas como Samsung, Hikvision. Las notificaciones son extraídas de los correos electrónicos y almacenadas en una base de datos. El proyecto incluye una interfaz de usuario creada con React.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- `client`: Esta es la parte del frontend de la aplicación, creada con React. Aquí es donde se encuentra la interfaz de usuario que interactúa con el backend.
- `server`: Esta es la parte del backend de la aplicación, donde se realiza la extracción de los correos electrónicos y se interactúa con la base de datos.

## Tecnologías Utilizadas

El proyecto se ha desarrollado utilizando las siguientes tecnologías:

- [Node.js](https://nodejs.org/): Un entorno de ejecución para JavaScript construido con el motor de JavaScript V8 de Chrome.
- [MySQL](https://www.mysql.com/): Un sistema de gestión de bases de datos relacional, multihilo y multiusuario con más de seis millones de instalaciones.
- [Express](https://expressjs.com/): Un marco de aplicación web de back-end para Node.js, diseñado para construir aplicaciones web y API.
- [Sequelize](https://sequelize.org/): Un ORM basado en promesas para Node.js y io.js. Soporta los dialectos PostgreSQL, MySQL, MariaDB, SQLite y MSSQL y cuenta con una sólida transacción.
- [IMAP](https://tools.ietf.org/html/rfc3501): Un protocolo de Internet que permite a un cliente de correo electrónico obtener acceso al correo electrónico en un servidor de correo.
- [React](https://reactjs.org/): Una biblioteca de JavaScript para construir interfaces de usuario.

## Backend

El backend de la aplicación ha sido desarrollado utilizando [Node.js](https://nodejs.org/), un entorno de ejecución para JavaScript. Se utiliza [Express](https://expressjs.com/), un marco de aplicación web de back-end para Node.js, para construir la API que interactúa con el frontend y la base de datos.

La estructura del backend se encuentra en la carpeta `server`. Aquí es donde se encuentra el código que interactúa con la base de datos y maneja las solicitudes del cliente.

### Dependencias del Backend

El proyecto utiliza las siguientes dependencias:

- `dotenv`: ^16.3.1
- `express`: ^4.18.2
- `imap`: ^0.8.19
- `mailparser`: ^3.6.6
- `morgan`: ^1.10.0
- `mysql2`: ^3.7.0
- `sequelize`: ^6.6.2

### Dependencias de Desarrollo del Backend

- `@faker-js/faker`: ^8.0.2
- `nodemon`: ^3.0.2
- `sequelize-cli`: ^6.6.2

## Frontend

El frontend de la aplicación ha sido desarrollado utilizando [React](https://reactjs.org/), una biblioteca de JavaScript para construir interfaces de usuario. React permite crear componentes reutilizables, lo que facilita el mantenimiento y la escalabilidad de la aplicación.

La estructura del frontend se encuentra en la carpeta `client`. Aquí es donde se encuentran todos los componentes de React, los estilos y los assets utilizados en la interfaz de usuario.

### Dependencias del Frontend

El proyecto utiliza las siguientes dependencias para el frontend:

- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `axios`: ^1.6.5
- `bootstrap`: ^5.3.2
- `react-bootstrap`: ^2.10.0
- `react-router-dom`: ^6.21.3
- `react-hook-form`: ^7.49.3
- `react-toastify`: ^10.0.4
- `styled-components`: ^6.1.8
- `react-data-table-component`: ^7.6.2
- `react-icons`: ^5.0.1

### Dependencias de Desarrollo del Frontend

- `@types/react`: ^18.2.43
- `@types/react-dom`: ^18.2.17
- `eslint`: ^8.55.0
- `vite`: ^5.0.8

## Instalación y Configuración del Proyecto

### Backend

Para poner en marcha el backend del proyecto, sigue estos pasos:

1. Clona el repositorio.
2. Navega a la carpeta `server` con el comando `cd server`.
3. Instala las dependencias con `npm install`.
4. Configura tus variables de entorno creando un archivo `.env` en la raíz del proyecto. Ejemplo:
   ```env
   EMAIL_USER_HV=tu_usuario
   EMAIL_PASSWORD_HV=tu_contraseña
   EMAIL_HOST_HV=tu_host
   IMAP_PORT=993
   EMAIL_TLS=true
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=nombre_de_tu_base_de_datos