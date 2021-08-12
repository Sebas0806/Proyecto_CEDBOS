const connection = require('../../config/db'),
	edad = require('../../public/js/edad'),
	bcryptjs = require('bcryptjs');

const authControllers = {};

authControllers.landingpageview = (req, res) => {
	res.render('../views/LandingPage.ejs');
};
authControllers.checkdocumentview = (req, res) => {
	if (req.session.loggedin) {
		res.redirect('/Home');
	} else {
		res.render('../views/auth/CheckDocument.ejs');
	}
};

authControllers.recoverpassview = (req, res) => {
	if (req.session.loggedin) {
		res.redirect('/Home');
	} else {
		res.render('../views/auth/RecoverPass.ejs');
	}
};

authControllers.recovernewpassview = (req, res) => {
	if (req.session.loggedin) {
		res.redirect('/Home');
	} else {
		res.render('../views/auth/NewPass.ejs');
	}
};

// Metodo de renderizacion (register)
authControllers.registerview = (req, res) => {
	if (req.session.loggedin) {
		res.redirect('/Home');
	} else {
		res.render('../views/auth/Register.ejs');
	}
};

// Metodo de renderizacion (login)
authControllers.loginview = (req, res) => {
	if (req.session.loggedin) {
		res.redirect('/home');
	} else {
		res.render('../views/auth/Login.ejs');
	}
};

authControllers.checkdocument = async (req, res) => {
	const { NIP } = req.body;
	req.session.nip = NIP;
	connection.query(
		'SELECT * FROM integrantes WHERE NIP = ?',
		[NIP],
		async (err, results) => {
			if (err) {
				console.log(err);
			} else {
				if (results[0]) {
					if (
						results[0].CondicionUsuario ||
						edad(results[0].nacimiento) >= 15
					) {
						connection.query(
							'SELECT * FROM users WHERE NIP = ?',
							[NIP],
							async (err, results) => {
								if (err) {
									console.log(err);
								} else {
									console.log(results[0].User);
									if (
										results[0] &&
										results[0].User != 'Usuario sin crear'
									) {
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
										connection.query(
											'UPDATE integrantes SET CondicionUsuario = 1 WHERE NIP = ?',
											[results[0].User],
											(err) => {
												if (err) {
													console.log(err);
												} else {
													res.render(
														'../views/auth/CheckDocument.ejs',
														{
															alert: true,
															alertTitle:
																'Preparando para registro',
															alertMessage:
																'Redireccionando a pagina de registro',
															alertIcon:
																'success',
															showConfirmButton: false,
															ruta: 'register',
														}
													);
												}
											}
										);
									}
								}
							}
						);
					} else {
						res.render('../views/auth/CheckDocument.ejs', {
							alert: true,
							alertTitle: 'Usuario bloqueado',
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
authControllers.register = async (req, res) => {
	const { user, pass, question, answer } = req.body;
	let PasswordHash = await bcryptjs.hash(pass, 8),
		AnswerHash = await bcryptjs.hash(answer, 8);

	//? Insertar los datos en la tabla users
	console.log(req.session.nip);
	connection.query(
		'UPDATE integrantes INNER JOIN users ON integrantes.NIP = users.NIP SET users.User = ?, users.Pass = ?, users.Question = ?, users.Answer = ?, users.SuperUser = 0, integrantes.CondicionUsuario = 1 WHERE users.NIP = ?',
		[user, PasswordHash, question, AnswerHash, req.session.nip],
		(err) => {
			if (err) {
				console.log(err);
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
authControllers.auth = async (req, res) => {
	const { user, pass } = req.body;

	if (user && pass) {
		connection.query(
			'SELECT * FROM Users WHERE User = ?',
			[user],
			async (err, results) => {
				if (err) {
					console.log(err);
				} else {
					if (results.length === 0) {
						res.render('../views/auth/Login.ejs', {
							alert: true,
							alertTitle: 'El usuario no existe',
							alertMessage: '',
							alertIcon: 'error',
							showConfirmButton: true,
							ruta: 'login',
						});
					} else if (
						!(await bcryptjs.compare(pass, results[0].Pass))
					) {
						res.render('../views/auth/Login.ejs', {
							alert: true,
							alertTitle: 'Contraseña incorrecta',
							alertMessage: 'Intentalo de nuevo',
							alertIcon: 'error',
							showConfirmButton: true,
							ruta: 'login',
						});
					} else {
						req.session.admin = results[0].SuperUser;
						connection.query(
							'SELECT * FROM Integrantes WHERE NIP = ?',
							[results[0].NIP],
							async (err, results) => {
								if (err) {
									console.log(err);
								} else {
									if (results[0].EstadoMiembro) {
										if (results[0].CondicionUsuario) {
											req.session.loggedin = true;
											req.session.name =
												results[0].NombreCompleto;

											res.render(
												'../views/auth/Login.ejs',
												{
													alert: true,
													alertTitle:
														'Has ingresado correctamente',
													alertMessage:
														'Conexion exitosa',
													alertIcon: 'success',
													showConfirmButton: true,
													ruta: 'Home',
												}
											);
										} else {
											res.render(
												'../views/auth/Login.ejs',
												{
													alert: true,
													alertTitle: 'Bloqueado',
													alertMessage:
														'El usuario se encuentra bloqueado',
													alertIcon: 'error',
													showConfirmButton: true,
													ruta: '/',
												}
											);
										}
									} else {
										res.render('../views/auth/Login.ejs', {
											alert: true,
											alertTitle: 'Usuario desactivado',
											alertMessage:
												'El usuario se ha eliminado',
											alertIcon: 'error',
											showConfirmButton: true,
											ruta: '/',
										});
									}
								}
							}
						);
					}
				}
			}
		);
	}
};

// Metodo de inicio de sesion
authControllers.signin = (req, res) => {
	if (req.session.loggedin) {
		res.render('../views/hometools/HomePage.ejs', {
			login: true,
			admin: req.session.admin,
			name: req.session.name,
		});
	} else {
		res.redirect('/login');
	}
};

// Metodo de cierre de sesion
authControllers.signoff = (req, res) => {
	req.session.destroy(() => {
		res.redirect('/');
	});
};

authControllers.recover = async (req, res) => {
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

authControllers.newpass = async (req, res) => {
	const { pass } = req.body;
	let NewPassHash = await bcryptjs.hash(pass, 8);

	connection.query(
		'UPDATE users SET Pass = ? WHERE user = ?',
		[NewPassHash, req.session.user],
		(err) => {
			if (err) {
				console.log(err);
			} else {
				res.render('../views/auth/NewPass.ejs', {
					alert: true,
					alertTitle: 'Se ha cambiado exitosamente su contraseña',
					alertMessage: '',
					alertIcon: 'success',
					showConfirmButton: true,
					ruta: 'login',
				});
			}
		}
	);
};

module.exports = authControllers;
