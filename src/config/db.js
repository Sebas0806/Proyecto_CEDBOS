const mysql = require('mysql');

// Establecimiento de los atributos de la conexion mysql
const connection = mysql.createConnection({
	host: 'us-cdbr-east-04.cleardb.com',
	user: 'b717daa3ce9f57',
	database: 'heroku_c90549540244ce3',
	password: '3e9ffce6',
});

function handleDisconnect(connection) {
	newConnection = mysql.createPool(connection);

	newConnection.getConnection((err) => {
		if (err) {
			console.log('Error de conexion con db:', err);
			setTimeout(handleDisconnect, 2000);
		}
	});

	newConnection.on('error', (err) => {
		console.log('Db error', err);
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			handleDisconnect();
		} else {
			throw err;
		}
	});
}

handleDisconnect(connection);

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
