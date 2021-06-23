const app = require('./config/server'),
	auth = require('./app/routes/AuthRouter'),
	HomeTools = require('./app/routes/HometoolsRouter'),
	connection = require('./config/db');

app.use('/', auth);
app.use('/home', HomeTools);

app.listen(app.get('port'), () => {
	console.log('Servidor en el puerto: ', app.get('port'));
});
