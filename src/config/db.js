const mysql = require('mysql');

// Establecimiento de los atributos de la conexion mysql
const DataConnection = {
	host: 'us-cdbr-east-04.cleardb.com',
	user: 'b717daa3ce9f57',
	database: 'heroku_c90549540244ce3',
	password: '3e9ffce6',
};

function handleDisconnect(DataConnection) {
	const connection = mysql.createPool(DataConnection);

	connection.getConnection((err) => {
		if (err) {
			console.log('Error de conexion con db:', err);
			setTimeout(handleDisconnect, 2000);
		} else {
			console.log('Conectado exitosamente con la DB');
		}
	});

	connection.on('error', (err) => {
		console.log('Db error', err);
		if (err.code === 'PROTOCOL_DataConnection_LOST') {
			handleDisconnect();
		} else {
			throw err;
		}
	});

	return connection;
}

const connection = handleDisconnect(DataConnection);

// Exportacion de la conexion
module.exports = connection;
