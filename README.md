# Sistema de Notificación de Cámaras y Bancos

Este proyecto es un sistema que captura las notificaciones de desconexión de video de cámaras de distintas marcas como Samsung, Hikvision, etc., y las notificaciones de transferencias de pagos de distintos bancos como BCP, Interbank, BBVA, Scotiabank, etc. Las notificaciones son extraídas de los correos electrónicos y almacenadas en una base de datos. Actualmente, el proyecto se encuentra en su segunda fase de desarrollo e incluye una interfaz de usuario creada con React.


## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- `client`: Esta es la parte del frontend de la aplicación, creada con React. Aquí es donde se encuentra la interfaz de usuario que interactúa con el backend.
- `server`: Esta es la parte del backend de la aplicación, donde se realiza la extracción de los correos electrónicos y se interactúa con la base de datos.


## Tecnologías Utilizadas

El proyecto se ha desarrollado utilizando las siguientes tecnologías:

- [Node.js](https://nodejs.org/): Un entorno de ejecución para JavaScript construido con el motor de JavaScript V8 de Chrome.
- [MySQL](https://www.mysql.com/): Un sistema de gestión de bases de datos relacional, multihilo y multiusuario con más de seis millones de instalaciones.
- [Express](https://expressjs.com/): Un marco de aplicación web de back-end para Node.js, diseñado para construir aplicaciones web y API.
- [Sequelize](https://sequelize.org/): Un ORM basado en promesas para Node.js y io.js. Soporta las dialectos PostgreSQL, MySQL, MariaDB, SQLite y MSSQL y cuenta con una sólida transacción.
- [IMAP](https://tools.ietf.org/html/rfc3501): Un protocolo de Internet que permite a un cliente de correo electrónico obtener acceso al correo electrónico en un servidor de correo.


## Backend

El backend de la aplicación ha sido desarrollado utilizando [Node.js](https://nodejs.org/), un entorno de ejecución para JavaScript. Se utiliza [Express](https://expressjs.com/), un marco de aplicación web de back-end para Node.js, para construir la API que interactúa con el frontend y la base de datos.

La estructura del backend se encuentra en la carpeta `server`. Aquí es donde se encuentra el código que interactúa con la base de datos y maneja las solicitudes del cliente.


## Dependencias del Backend

El proyecto utiliza las siguientes dependencias:

- `dotenv`: ^16.3.1
- `express`: ^4.18.2
- `imap`: ^0.8.19
- `mailparser`: ^3.6.6
- `morgan`: ^1.10.0
- `mysql2`: ^3.7.0
- `react`: ^17.0.2
- `react-dom`: ^17.0.2
- `react-scripts`: ^5.0.0


## Dependencias de Desarrollo del Backend

- `@faker-js/faker`: ^8.0.2
- `nodemon`: ^3.0.2
- `sequelize-cli`: ^6.6.2

Cada dependencia tiene un papel específico en el funcionamiento del proyecto. Por ejemplo, `dotenv` se utiliza para cargar variables de entorno desde un archivo `.env` a `process.env`. `express` se utiliza para crear el servidor web. `mysql2` se utiliza para conectarse a la base de datos MySQL. `morgan` se utiliza para registrar las solicitudes HTTP en la consola. `imap` y `mailparser` se utilizan para conectarse a un servidor IMAP y analizar los mensajes de correo electrónico.


## Frontend

El frontend de la aplicación ha sido desarrollado utilizando [React](https://reactjs.org/), una biblioteca de JavaScript para construir interfaces de usuario. React permite crear componentes reutilizables, lo que facilita el mantenimiento y la escalabilidad de la aplicación.

La estructura del frontend se encuentra en la carpeta `client`. Aquí es donde se encuentran todos los componentes de React, los estilos y los assets utilizados en la interfaz de usuario.


### Dependencias del Frontend

El proyecto utiliza las siguientes dependencias para el frontend:

- `react`: ^18.2.0 - La biblioteca principal que permite construir la interfaz de usuario.
- `react-dom`: ^18.2.0 - Permite la manipulación del DOM en React.
- `axios`: ^1.6.5 - Cliente HTTP basado en promesas para el navegador y node.js. Se utiliza para hacer solicitudes al servidor.
- `bootstrap`: ^5.3.2 y `react-bootstrap`: ^2.10.0 - Frameworks de CSS para construir interfaces de usuario responsivas y atractivas.
- `react-router-dom`: ^6.21.3 - Se utiliza para manejar el enrutamiento en la aplicación React.
- `react-hook-form`: ^7.49.3 - Biblioteca para manejar formularios en React. Permite una fácil validación y manejo de los datos del formulario.
- `react-toastify`: ^10.0.4 - Permite mostrar notificaciones en la aplicación.
- `styled-components`: ^6.1.8 - Biblioteca para manejar estilos CSS en componentes de React.
- `react-data-table-component`: ^7.6.2 - Componente de tabla para React con características como paginación, ordenación, etc.
- `react-icons`: ^5.0.1 - Biblioteca de iconos para React.


### Dependencias de Desarrollo

- `@types/react`: ^18.2.43 y `@types/react-dom`: ^18.2.17 - Proporcionan las definiciones de tipos para React y ReactDOM para trabajar con TypeScript.
- `eslint`: ^8.55.0 y plugins relacionados - Herramienta para identificar y reportar patrones encontrados en el código ECMAScript/JavaScript.
- `vite`: ^5.0.8 - Herramienta de construcción que proporciona un entorno de desarrollo más rápido y eficiente.


## Instalación y Configuración del Proyecto (Servidor)

Para poner en marcha el proyecto, sigue estos pasos:

1. Clona el repositorio.
2. Instala las dependencias con `npm install`.
3. Configura tus variables de entorno creando un archivo `.env` en la raíz del proyecto. Ejemplo:
4. Ejecuta las migraciones de la base de datos (Asegúrate de tener configurada la base de datos MySQL).
5. Inicia el servidor con `npm start`.
6. Inicia la aplicación de React con `npm start` en la carpeta `client`.


## Instalación del Frontend

Para instalar y ejecutar el frontend de la aplicación, sigue estos pasos:

1. Navega a la carpeta `client` con el comando `cd client`.
2. Instala las dependencias con el comando `npm install`.
3. Inicia el servidor de desarrollo con el comando `npm run dev`.

Esto instalará todas las dependencias necesarias para el frontend y luego iniciará el servidor de desarrollo. Por defecto, la aplicación se ejecutará en `http://localhost:5173`.

Por favor, asegúrate de que el backend esté en funcionamiento y accesible para que el frontend pueda interactuar con él correctamente.


## Uso

1. Llena todas las variables de entorno en el archivo `.env` según las necesidades de tu proyecto.
2. Inicia el servidor con el comando `npm start` en la carpeta `server`.
3. Verifica que el servidor esté funcionando correctamente visitando las rutas de procesamiento de correos:
   - Para los DVR: `http://localhost:5000/api/v1/process-emails-cctv`
   - Para los bancos: `http://localhost:5000/api/v1/process-emails-ts`
   Estas rutas procesarán los correos electrónicos y guardarán la información relevante en la base de datos.
4. Para verificar los datos en la base de datos, puedes usar las herramientas de tu elección. Si estás utilizando Sequelize, puedes revisar el archivo `scripts` para encontrar los comandos de migración y seeder.
5. Inicia la aplicación de React con el comando `npm run dev` en la carpeta `client`.
6. Abre la aplicación en el navegador y comprueba que los datos se muestran correctamente en la interfaz de usuario.


## Modelo Vista Controlador

![Modelo Vista Controlador](./img/mvc.jpg)

## Estructura de Extracción de Correos

![Estructura de Extracción de Correos](./img/controller.jpg)‣捣癴਍