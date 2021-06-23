const mysql = require('mysql');

// Establecimiento de los atributos de la conexion mysql
const connection = mysql.createConnection({
	host: process.env.DdHost,
	user: process.env.DbUser,
	database: process.env.DbDatabase,
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
