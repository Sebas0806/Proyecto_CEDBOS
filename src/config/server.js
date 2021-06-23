const express = require('express'),
	session = require('express-session'),
	path = require('path'),
	dotenv = require('dotenv');

// Inicializacion del servidor
const app = express();

// Configuracion del puerto del servidor
app.set('port', process.env.PORT || 3000);

// Configuracion del visualizador de plantillas (ejs)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../app/views'));

// Configuracion de middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuracion de rutas de acceso para las variables de entorno
dotenv.config({ path: path.join(__dirname, '../env/.env') });

// Establecimiento ruta de acceso estatica para los elementos front-end
app.use('/resources', express.static(path.join(__dirname, '../public')));

// Configuracion del manejo de sesiones
app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true,
	})
);

// Exportacion del servidor
module.exports = app;
