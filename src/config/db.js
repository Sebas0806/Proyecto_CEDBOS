const mysql = require('mysql');

// Establecimiento de los atributos de la conexion mysql
const connection = mysql.createConnection({
	host: 'us-cdbr-east-04.cleardb.com',
	user: 'b717daa3ce9f57',
	database: 'heroku_c90549540244ce3',
	password: '3e9ffce6',
});

// Inicializacion de la conexion con la base de datos
connection.connect((err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log('Conectado exitosamente con la DB');
});

// Exportacion de la conexion
module.exports = connection;
