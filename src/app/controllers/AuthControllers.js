const connection = require('../../config/db'),
	bcryptjs = require('bcryptjs');

const AuthControllers = {};
const edad = (fecha) => {
	let nacimiento = new Date(fecha);
	let hoy = new Date();

	let edad = hoy.getFullYear() - nacimiento.getFullYear();
	let diferenciaMeses = hoy.getMonth() - nacimiento.getMonth();
	if (
		diferenciaMeses < 0 ||
		(diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
	) {
		edad--;
	}
	return edad;
};

AuthControllers.landingpageview = (req, res) => {
	res.render('../views/LandingPage.ejs');
};
AuthControllers.checkdocumentview = (req, res) => {
	res.render('../views/auth/CheckDocument.ejs');
};

AuthControllers.recoverpassview = (req, res) => {
	res.render('../views/auth/RecoverPass.ejs');
};

AuthControllers.recovernewpassview = (req, res) => {
	res.render('../views/auth/NewPass.ejs');
};

// Metodo de renderizacion (register)
AuthControllers.registerview = (req, res) => {
	res.render('../views/auth/Register.ejs');
};

// Metodo de renderizacion (login)
AuthControllers.loginview = (req, res) => {
	if (req.session.loggedin) {
		res.redirect('/home');
	} else {
		res.render('../views/auth/Login.ejs');
	}
};

AuthControllers.checkdocument = async (req, res) => {
	const { NIP } = req.body;
	let admin = await bcryptjs.hash('CEDBOS*admin', 8);
	req.session.nip = NIP;
	connection.query(
		'SELECT * FROM integrantes WHERE NIP = ?',
		[NIP],
		async (error, results) => {
			if (error) {
				console.log(error);
			} else {
				if (results[0]) {
					if (
						results[0].CondicionUsuario ||
						edad(results[0].nacimiento) >= 15
					) {
						connection.query(
							'SELECT * FROM users WHERE NIP = ?',
							[NIP],
							async (error, results) => {
								if (error) {
									console.log(error);
								} else {
									if (results[0]) {
										res.render(
											'../views/auth/CheckDocument.ejs',
											{
												alert: true,
												alertTitle: 'Usuario existente',
												alertMessage:
													'El usuario ya se encuentra registrado',
												alertIcon: 'error',
												showConfirmButton: false,
												ruta: 'register/checkdocument',
											}
										);
									} else {
										res.render(
											'../views/auth/CheckDocument.ejs',
											{
												alert: true,
												alertTitle:
													'Preparando para registro',
												alertMessage:
													'Redireccionando a pagina de registro',
												alertIcon: 'success',
												showConfirmButton: false,
												ruta: 'register',
											}
										);
									}
								}
							}
						);
					} else {
						res.render('../views/auth/CheckDocument.ejs', {
							alert: true,
							alertTitle: 'Usuario inactivo',
							alertMessage:
								'El miembro no se ha activado para tener un usuario',
							alertIcon: 'error',
							showConfirmButton: false,
							ruta: '',
						});
					}
				} else {
					res.render('../views/auth/CheckDocument.ejs', {
						alert: true,
						alertTitle: 'Miembro invalido',
						alertMessage: 'Documento no identificado',
						alertIcon: 'error',
						showConfirmButton: false,
						ruta: '',
					});
				}
			}
		}
	);
};

// Metodo de registro de datos
AuthControllers.register = async (req, res) => {
	const { user, pass, question, answer } = req.body;
	let PasswordHash = await bcryptjs.hash(pass, 8),
		AnswerHash = await bcryptjs.hash(answer, 8);

	//? Insertar los datos en la tabla users
	connection.query(
		'INSERT INTO users SET ?',
		{
			NIP: req.session.nip,
			User: user,
			Pass: PasswordHash,
			Question: question,
			Answer: AnswerHash,
			SuperUser: 0,
		},
		async (error, results) => {
			if (error) {
				console.log(error);
			} else {
				res.render('../views/auth/Register.ejs', {
					alert: true,
					alertTitle: 'Registrado',
					alertMessage: 'El registro de usuario ha sido exitoso',
					alertIcon: 'success',
					showConfirmButton: false,
					ruta: 'login',
				});
			}
		}
	);
};

// Metodo de comprobacion de usuario (login)
AuthControllers.auth = async (req, res) => {
	const { user, pass } = req.body;
	console.log(req.body);

	if (user && pass) {
		connection.query(
			'SELECT * FROM Users WHERE User = ?',
			[user],
			async (err, results) => {
				console.log(results);
				if (results.length === 0) {
					res.render('../views/auth/Login.ejs', {
						alert: true,
						alertTitle: 'El usuario no existe',
						alertMessage: '',
						alertIcon: 'error',
						showConfirmButton: true,
						ruta: 'login',
					});
				} else if (!(await bcryptjs.compare(pass, results[0].Pass))) {
					res.render('../views/auth/Login.ejs', {
						alert: true,
						alertTitle: 'Contraseña incorrecta',
						alertMessage: 'Intentalo de nuevo',
						alertIcon: 'error',
						showConfirmButton: true,
						ruta: 'login',
					});
				} else {
					connection.query(
						'SELECT * FROM Integrantes WHERE NIP = ?',
						[results[0].NIP],
						async (error, results) => {
							req.session.loggedin = true;
							req.session.name = results[0].NombreCompleto;

							res.render('../views/auth/Login.ejs', {
								alert: true,
								alertTitle: 'Has ingresado correctamente',
								alertMessage: 'Conexion exitosa',
								alertIcon: 'success',
								showConfirmButton: true,
								ruta: 'Home',
							});
						}
					);
				}
			}
		);
	}
};

// Metodo de inicio de sesion
AuthControllers.signin = (req, res) => {
	if (req.session.loggedin) {
		res.render('../views/hometools/HomePage.ejs', {
			login: true,
			name: req.session.name,
		});
	} else {
		res.redirect('/login');
	}
};

// Metodo de cierre de sesion
AuthControllers.signoff = (req, res) => {
	req.session.destroy(() => {
		res.redirect('/');
	});
};

AuthControllers.recover = async (req, res) => {
	const { user, Question, Answer } = req.body;
	console.log(req.body);

	if (user && Question && Answer) {
		connection.query(
			'SELECT * FROM users WHERE user = ?',
			[user],
			async (err, results) => {
				console.log(results);
				if (results.length === 0) {
					res.render('../views/auth/RecoverPass.ejs', {
						alert: true,
						alertTitle: 'El usuario no existe',
						alertMessage: '',
						alertIcon: 'error',
						showConfirmButton: true,
						ruta: 'recover',
					});
				} else if (!(results[0].Question == Question)) {
					res.render('../views/RecoverPass.ejs', {
						alert: true,
						alertTitle: 'No coinciden la pregunta seleccionada',
						alertMessage: 'Intentalo de nuevo',
						alertIcon: 'error',
						showConfirmButton: true,
						ruta: 'recover',
					});
				} else {
					if (await bcryptjs.compare(Answer, results[0].Answer)) {
						req.session.user = user;
						res.render('../views/auth/RecoverPass.ejs', {
							alert: true,
							alertTitle: 'Datos correctos',
							alertMessage: 'Accediendo para cambiar contraseña',
							alertIcon: 'success',
							showConfirmButton: true,
							ruta: 'recover/newpass',
						});
					} else {
						res.render('../views/auth/RecoverPass.ejs', {
							alert: true,
							alertTitle: 'Las respuesta no coincide',
							alertMessage: 'vuelve a intentarlo',
							alertIcon: 'error',
							showConfirmButton: true,
							ruta: 'recover',
						});
					}
				}
			}
		);
	}
};

AuthControllers.newpass = async (req, res) => {
	const { pass } = req.body;
	let NewPassHash = await bcryptjs.hash(pass, 8);

	connection.query(
		'UPDATE users SET Pass = ? WHERE users = ?',
		[NewPassHash, req.session.user],
		async (err, results) => {
			res.render('../views/auth/NewPass.ejs', {
				alert: true,
				alertTitle: 'Se ha cambiado exitosamente su contraseña',
				alertMessage: '',
				alertIcon: 'success',
				showConfirmButton: true,
				ruta: 'login',
			});
		}
	);
};

module.exports = AuthControllers;
