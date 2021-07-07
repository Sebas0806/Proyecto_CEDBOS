const connection = require('../../config/db');

const Homecontrollers = {};

Homecontrollers.registerstudentview = (req, res) => {
	if (req.session.loggedin) {
		res.render('../views/hometools/HomeRegisterUser.ejs');
	} else {
		res.redirect('/login');
	}
};

Homecontrollers.registerproductview = (req, res) => {
	if (req.session.loggedin) {
		res.render('../views/hometools/HomeRegisterProduct.ejs');
	} else {
		res.redirect('/login');
	}
};
Homecontrollers.registerstudent = async (req, res) => {
	const {
		name,
		lastname,
		municipality,
		neighborhood,
		address,
		email,
		typedocument,
		document,
		telephone,
		cel,
		sex,
		date,
	} = req.body;

	connection.query(
		' SELECT * FROM integrantes WHERE NIP = ?',
		[document],
		async (error, results) => {
			if (error) {
				console.log(error);
			} else {
				if (results[0]) {
					res.render('../views/hometools/HomeRegisterUser.ejs', {
						alert: true,
						alertTitle: 'Error',
						alertMessage: 'El miembro ya se encuentra registrado',
						alertIcon: 'error',
						showConfirmButton: false,
						ruta: 'Home/registerstudent',
					});
				} else {
					connection.query(
						'INSERT INTO integrantes SET ?',
						{
							NIP: document,
							td: typedocument,
							NombreCompleto: name + ' ' + lastname,
							barrio: neighborhood,
							municipio: municipality,
							direccion: address,
							telefono: telephone,
							celular: cel,
							email: email,
							nacimiento: date,
							sexo: sex,
							Idgrupo: 1,
						},
						async (error, results) => {
							if (error) {
								console.log(error);
							} else {
								res.render(
									'../views/hometools/HomeRegisterUser.ejs',
									{
										alert: true,
										alertTitle: 'Registrado',
										alertMessage:
											'El registro de miembro ha sido exitoso',
										alertIcon: 'success',
										showConfirmButton: false,
										ruta: 'Home/registerstudent',
									}
								);
							}
						}
					);
				}
			}
		}
	);
};

module.exports = Homecontrollers;
