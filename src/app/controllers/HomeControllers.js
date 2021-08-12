const connection = require('../../config/db');

const homeControllers = {};

homeControllers.registerstudentview = (req, res) => {
	if (req.session.loggedin) {
		res.render('../views/hometools/HomeRegisterUser.ejs', {
			admin: req.session.admin,
		});
	} else {
		res.redirect('/login');
	}
};

homeControllers.userhistorydelete = (req, res) => {
	const NIP = req.params.NIP;
	connection.query(
		'DELETE users, integrantes FROM users INNER JOIN integrantes ON users.NIP = integrantes.NIP WHERE users.NIP = ?',
		[NIP],
		(err) => {
			if (err) {
				console.log(err);
			} else {
				res.render('../views/hometools/HomeUserHistory.ejs', {
					restriction: true,
					admin: req.session.admin,
					userData: req.session.users,
					membersData: req.session.members,
					alert: true,
					alertTitle: 'Usuario eliminado',
					alertMessage: 'El usuario se ha eliminado permanentemente',
					alertIcon: 'success',
					showConfirmButton: false,
					ruta: 'home/userHistory',
				});
			}
		}
	);
};
homeControllers.userinactive = (req, res) => {
	connection.query(
		'SELECT b.* FROM integrantes a INNER JOIN users b on a.NIP = b.NIP WHERE a.EstadoMiembro = 0',
		(err, results) => {
			if (err) {
				console.log(err);
			} else {
				res.render('../views/hometools/HomeUserHistory.ejs', {
					restriction: false,
					admin: req.session.admin,
					userData: results,
					membersData: req.session.members,
				});
			}
		}
	);
};
homeControllers.monetarycontributionview = (req, res) => {
	if (req.session.loggedin && req.session.admin) {
		connection.query('SELECT Grado FROM Grados', (err, results) => {
			if (err) {
				console.log(err);
			} else {
				req.session.gradesAporte = results;
				res.render('../views/hometools/HomeMonetaryContribution.ejs', {
					admin: req.session.admin,
					grades: req.session.gradesAporte,
					conditional: false,
				});
			}
		});
	} else {
		res.redirect('/login');
	}
};
homeControllers.contributionGrade = (req, res) => {
	const { grado } = req.body;
	connection.query(
		'SELECT AportesMonetarios.IdAporte AS Id, AportesMonetarios.Dinero AS Dinero, AportesMonetarios.Mes AS Mes FROM Grados INNER JOIN AportesMonetarios ON Grados.IdGrado = AportesMonetarios.IdGrado WHERE Grados.Grado = ?',
		[grado],
		(err, results) => {
			if (err) {
				console.log(err);
			} else {
				console.log(results);
				res.render('../views/hometools/HomeMonetaryContribution.ejs', {
					admin: req.session.admin,
					conditional: true,
					aportes: results,
					grades: req.session.gradesAporte,
				});
			}
		}
	);
};
homeControllers.contributionDelete = (req, res) => {
	const idAporte = req.params.Id;
	connection.query(
		'UPDATE Grados INNER JOIN AportesMonetarios ON Grados.IdGrado = AportesMonetarios.IdGrado SET Grados.AporteTotal = Grados.AporteTotal - AportesMonetarios.Dinero WHERE AportesMonetarios.IdAporte = ?',
		[idAporte],
		(err) => {
			if (err) {
				console.log(err);
			} else {
				connection.query(
					'DELETE FROM AportesMonetarios WHERE IdAporte = ?',
					[idAporte],
					(err) => {
						if (err) {
							console.log(err);
						} else {
							res.render(
								'../views/hometools/HomeMonetaryContribution.ejs',
								{
									admin: req.session.admin,
									grades: req.session.gradesAporte,
									conditional: false,
									alert: true,
									alertTitle: 'Aporte eliminado',
									alertMessage:
										'El aporte monetario se ha eliminado',
									alertIcon: 'success',
									showConfirmButton: false,
									ruta: 'home/monetaryContribution',
								}
							);
						}
					}
				);
			}
		}
	);
};
homeControllers.userhistoryview = (req, res) => {
	if (req.session.loggedin && req.session.admin) {
		connection.query('SELECT * FROM users', (err, results) => {
			if (err) {
				console.log(err);
			} else {
				req.session.users = results;
				connection.query(
					'SELECT * FROM integrantes',
					(err, results) => {
						if (err) {
							console.log(err);
						} else {
							req.session.members = results;
							res.render(
								'../views/hometools/HomeUserHistory.ejs',
								{
									restriction: true,
									admin: req.session.admin,
									userData: req.session.users,
									membersData: req.session.members,
								}
							);
						}
					}
				);
			}
		});
	} else {
		res.redirect('/login');
	}
};

homeControllers.userhistorydeactivate = (req, res) => {
	const NIP = req.params.NIP;
	connection.query(
		'UPDATE integrantes SET EstadoMiembro = 0 WHERE NIP = ?',
		[NIP],
		(err) => {
			if (err) {
				console.log(err);
			} else {
				res.render('../views/hometools/HomeUserHistory.ejs', {
					restriction: true,
					admin: req.session.admin,
					userData: req.session.users,
					membersData: req.session.members,
					alert: true,
					alertTitle: 'Usuario modificado',
					alertMessage: 'El usuario se ha desactivado',
					alertIcon: 'success',
					showConfirmButton: false,
					ruta: 'home/userHistory',
				});
			}
		}
	);
};

homeControllers.productsnotivailable = (req, res) => {
	connection.query(
		'SELECT * FROM productos WHERE disponible = 0',
		(err, results) => {
			if (err) {
				console.log(err);
			} else {
				res.render('../views/hometools/HomeProductHistory.ejs', {
					disponibility: false,
					admin: req.session.admin,
					productData: results,
				});
			}
		}
	);
};

homeControllers.userHistoryBlock = async (req, res) => {
	const NIP = req.params.NIP;
	const conditional = (id) => {
		return new Promise((resolve, reject) => {
			connection.query(
				'SELECT CondicionUsuario FROM integrantes WHERE NIP = ?',
				[id],
				(err, results) => {
					if (err) {
						return reject(err);
					} else {
						resolve(results[0].CondicionUsuario);
					}
				}
			);
		});
	};
	const conditionalValue = await conditional(NIP);
	if (Number(conditionalValue)) {
		connection.query(
			'UPDATE integrantes SET CondicionUsuario = 0 WHERE NIP = ?',
			[NIP],
			(err) => {
				if (err) {
					console.log(err);
				} else {
					res.render('../views/hometools/HomeUserHistory.ejs', {
						restriction: true,
						admin: req.session.admin,
						userData: req.session.users,
						membersData: req.session.members,
						alert: true,
						alertTitle: 'Usuario modificado',
						alertMessage: 'El usuario se ha bloqueado',
						alertIcon: 'success',
						showConfirmButton: false,
						ruta: 'home/userHistory',
					});
				}
			}
		);
	} else {
		connection.query(
			'UPDATE integrantes SET CondicionUsuario = 1 WHERE NIP = ?',
			[NIP],
			(err) => {
				if (err) {
					console.log(err);
				} else {
					res.render('../views/hometools/HomeUserHistory.ejs', {
						restriction: true,
						admin: req.session.admin,
						userData: req.session.users,
						membersData: req.session.members,
						alert: true,
						alertTitle: 'Usuario modificado',
						alertMessage: 'El usuario se ha desbloqueado',
						alertIcon: 'success',
						showConfirmButton: false,
						ruta: 'home/userHistory',
					});
				}
			}
		);
	}
};

homeControllers.producthistoryview = (req, res) => {
	if (req.session.loggedin && req.session.admin) {
		connection.query('SELECT * FROM Productos', (err, results) => {
			if (err) {
				console.log(err);
			} else {
				req.session.productData = results;
				res.render('../views/hometools/HomeProductHistory.ejs', {
					disponibility: true,
					admin: req.session.admin,
					productData: req.session.productData,
				});
			}
		});
	} else {
		res.redirect('/login');
	}
};
homeControllers.foodbasketentregaview = (req, res) => {
	connection.query(
		'SELECT * FROM Mercados WHERE Entregado = 1',
		(err, results) => {
			if (err) {
				console.log(err);
			} else {
				res.render('../views/hometools/HomeFoodBasketHistory.ejs', {
					admin: req.session.admin,
					conditional: false,
					merData: results,
					productData: req.session.ProductsData,
				});
			}
		}
	);
};
homeControllers.foodbasketEntrega = (req, res) => {
	const IdMer = req.params.IdMer;
	connection.query(
		'UPDATE Mercados SET Entregado = 1 WHERE IdMer = ?',
		[IdMer],
		(err) => {
			if (err) {
				console.log(err);
			} else {
				res.render('../views/hometools/HomeFoodBasketHistory.ejs', {
					conditional: true,
					admin: req.session.admin,
					merData: req.session.merData,
					productData: req.session.ProductsData,
					alert: true,
					alertTitle: 'Mercado entregado',
					alertMessage: 'El mercado se ha reportado como entregado',
					alertIcon: 'success',
					showConfirmButton: false,
					ruta: 'home/foodBasketHistory',
				});
			}
		}
	);
};
homeControllers.foodbasketdisolver = (req, res) => {
	const IdMer = req.params.IdMer;
	connection.query(
		'UPDATE Productos SET Disponible = 1, IdMer = NULL  WHERE IdMer = ?',
		[IdMer],
		(err) => {
			if (err) {
				console.log(err);
			} else {
				connection.query(
					'DELETE FROM Mercados WHERE IdMer = ?',
					[IdMer],
					(err) => {
						if (err) {
							console.log(err);
						} else {
							res.render(
								'../views/hometools/HomeFoodBasketHistory.ejs',
								{
									admin: req.session.admin,
									merData: req.session.merData,
									productData: req.session.ProductsData,
									conditional: true,
									alert: true,
									alertTitle: 'Mercado disuelto',
									alertMessage: 'El mercado ha sido disuelto',
									alertIcon: 'success',
									showConfirmButton: false,
									ruta: 'home/foodBasketHistory',
								}
							);
						}
					}
				);
			}
		}
	);
};

homeControllers.foodbaskethistoryview = (req, res) => {
	if (req.session.loggedin && req.session.admin) {
		connection.query(
			'SELECT * FROM Productos WHERE IdMer IS NOT NULL',
			(err, results) => {
				if (err) {
					console.log(err);
				} else {
					req.session.ProductsData = results;
					connection.query(
						'SELECT * FROM Mercados',
						(err, results) => {
							if (err) {
								console.log(err);
							} else {
								req.session.merData = results;
								res.render(
									'../views/hometools/HomeFoodBasketHistory.ejs',
									{
										admin: req.session.admin,
										conditional: true,
										merData: req.session.merData,
										productData: req.session.ProductsData,
									}
								);
							}
						}
					);
				}
			}
		);
	} else {
		res.redirect('/login');
	}
};

homeControllers.foodbasketview = (req, res) => {
	if (req.session.loggedin && req.session.admin) {
		res.render('../views/hometools/HomeFoodBasket.ejs', {
			admin: req.session.admin,
		});
	} else {
		res.redirect('/login');
	}
};
homeControllers.producthistorydelete = (req, res) => {
	const idProduct = req.params.IdProducto;

	connection.query(
		'SELECT IdGrado FROM Productos WHERE IdProducto = ?',
		[idProduct],
		(err, results) => {
			if (err) {
				console.log(err);
			} else {
				const IdGrado = results[0].IdGrado;
				connection.query(
					'SELECT CantidadProductos FROM Grados WHERE IdGrado = ?',
					[IdGrado],
					(err, results) => {
						if (err) {
							console.log(err);
						} else {
							const cantidadTotal =
								Number(results[0].CantidadProductos) - 1;
							connection.query(
								'UPDATE Grados SET CantidadProductos= ? WHERE IdGrado = ?',
								[cantidadTotal, IdGrado],
								(err) => {
									if (err) {
										console.log(err);
									} else {
										connection.query(
											'DELETE FROM Productos WHERE IdProducto = ?',
											[idProduct],
											(err) => {
												if (err) {
													console.log(err);
												} else {
													res.render(
														'../views/hometools/HomeProductHistory.ejs',
														{
															admin: req.session
																.admin,
															disponibility: true,
															productData:
																req.session
																	.productData,
															alert: true,
															alertTitle:
																'Accion ejecutada',
															alertMessage:
																'Se ha eliminado el producto',
															alertIcon:
																'success',
															showConfirmButton: false,
															ruta: 'home/productHistory',
														}
													);
												}
											}
										);
									}
								}
							);
						}
					}
				);
			}
		}
	);
};
homeControllers.producthistoryedit = (req, res) => {
	const idProduct = req.params.IdProducto,
		{ nombreProducto, Marca, tipo_producto } = req.body;
	console.table(req.body);
	console.log(idProduct);
	connection.query(
		'UPDATE Productos SET NombreProducto = ?, Tipo = ?, Marca = ? WHERE IdProducto = ?',
		[nombreProducto, tipo_producto, Marca, idProduct],
		(err) => {
			if (err) {
				console.log(err);
			} else {
				res.render('../views/hometools/HomeProductHistory.ejs', {
					admin: req.session.admin,
					productData: req.session.productData,
					disponibility: true,
					alert: true,
					alertTitle: 'Accion ejecutada',
					alertMessage: 'Se ha editado correctamente',
					alertIcon: 'success',
					showConfirmButton: false,
					ruta: 'home/productHistory',
				});
			}
		}
	);
};
homeControllers.createfoodbasket = async (req, res) => {
	if (Object.keys(req.body).length) {
		const productByBasket = Object.values(req.body).map((items) =>
				Number(items)
			),
			productsType = Object.keys(req.body),
			QueryProductsType = (query) => {
				return new Promise((resolve, reject) => {
					connection.query(query, (err, result) => {
						if (err) {
							return reject(err);
						}
						resolve(result);
					});
				});
			},
			basketFoodMaxId = () => {
				return new Promise((resolve, reject) => {
					connection.query(
						'SELECT MAX(IdMer) AS maxId FROM Mercados',
						(err, result) => {
							if (err) {
								return reject(err);
							}
							if (!result[0].maxId) {
								resolve(1);
							} else {
								resolve(result[0].maxId + 1);
							}
						}
					);
				});
			};

		let queryStatement = '',
			productCount = 0,
			productsCountList = [];

		for (let i = 0; i < productsType.length; i++) {
			queryStatement = `SELECT COUNT(*) AS count FROM Productos WHERE Tipo = '${productsType[i]}' AND IdMer IS NULL`;
			productCount = await QueryProductsType(queryStatement);
			productsCountList.push(
				parseInt(productCount[0].count / productByBasket[i])
			);
		}
		let idList = [];
		const minValue = productsCountList.reduce((acc, ele) =>
				acc < ele ? acc : ele
			),
			maxId = await basketFoodMaxId();

		console.log(minValue);
		if (minValue) {
			for (let i = 0; i < minValue; i++) {
				idList.push(maxId + i);
				connection.query(
					'INSERT INTO Mercados SET ?',
					{
						IdMer: maxId + i,
						Idgrupo: 1,
						Entregado: 0,
					},
					(err) => {
						if (err) {
							console.log(err);
						} else {
							for (let j = 0; j < productByBasket.length; j++) {
								connection.query(
									`UPDATE Productos SET IdMer = '${
										maxId + i
									}', disponible = 0 WHERE IdMer IS NULL AND Tipo = '${
										productsType[j]
									}' LIMIT ${productByBasket[j]} `
								),
									(err) => {
										if (err) {
											console.log(err);
										}
									};
							}
						}
						if (i == minValue - 1) {
							connection.query(
								'SELECT * FROM Productos WHERE IdMer IN (?)',
								[idList],
								(err, results) => {
									if (err) {
										console.log(err);
									} else {
										res.render(
											'../views/hometools/HomeFoodBasket.ejs',
											{
												admin: req.session.admin,
												alert: true,
												alertTitle:
													'Mercados creados exitosamente',
												alertMessage: `Se han creado ${minValue} mercados`,
												alertIcon: 'success',
												showConfirmButton: false,
												ruta: 'home/foodbasket',
											}
										);
										console.log(results);
									}
								}
							);
						}
					}
				);
			}
		} else {
			res.render('../views/hometools/HomeFoodBasket.ejs', {
				admin: req.session.admin,
				alert: true,
				alertTitle: 'Productos insuficientes',
				alertMessage: 'No se ha creado ningun mercado',
				alertIcon: 'error',
				showConfirmButton: false,
				ruta: 'home/foodbasket',
			});
		}
	} else {
		res.render('../views/hometools/HomeFoodBasket.ejs', {
			admin: req.session.admin,
			alert: true,
			alertTitle: 'Error',
			alertMessage: 'No se ha seleccionado ningun producto',
			alertIcon: 'error',
			showConfirmButton: false,
			ruta: 'home/foodbasket',
		});
	}
};

homeControllers.registerproductview = (req, res) => {
	if (req.session.loggedin) {
		connection.query(
			'SELECT Grado FROM grados ORDER BY Grado ASC',
			async (err, results) => {
				if (err) {
					console.log(err);
				} else {
					console.log(results);
					res.render('../views/hometools/HomeRegisterProduct.ejs', {
						admin: req.session.admin,
						grados: results,
					});
				}
			}
		);
	} else {
		res.redirect('/login');
	}
};

homeControllers.registerproduct = async (req, res) => {
	const { nombre_producto, tipo_producto, cantidad, marca, grado } = req.body;
	connection.query(
		'SELECT * FROM grados WHERE grado = ?',
		grado,
		async (err, results) => {
			if (err) {
				console.log(err);
			} else {
				const gradoId = results[0].IdGrado,
					cantidadproducto = results[0].CantidadProductos;
				for (let i = 0; i < cantidad; i++) {
					connection.query(
						'INSERT INTO Productos SET ?',
						{
							IdGrado: gradoId,
							NombreProducto: nombre_producto,
							Tipo: tipo_producto,
							Marca: marca,
							Disponible: 1,
						},
						async (err, results) => {
							if (err) {
								console.log(err);
							}
						}
					);
				}
				connection.query(
					'UPDATE Grados SET CantidadProductos = ? WHERE IdGrado = ?',
					[Number(cantidadproducto) + Number(cantidad), gradoId],
					async (err, results) => {
						if (err) {
							console.log(err);
						} else {
							res.render(
								'../views/hometools/HomeRegisterUser.ejs',
								{
									admin: req.session.admin,
									alert: true,
									alertTitle: 'Producto registrado',
									alertMessage:
										'Se ha registrado correctamente el producto',
									alertIcon: 'success',
									showConfirmButton: false,
									ruta: 'Home/product',
								}
							);
						}
					}
				);
			}
		}
	);
};

homeControllers.registergradeview = (req, res) => {
	if (req.session.loggedin && req.session.admin) {
		connection.query('SELECT * FROM grados', async (err, results) => {
			if (err) {
				console.log(err);
			} else {
				req.session.grades = results;
				res.render('../views/hometools/HomeRegisterGrade.ejs', {
					admin: req.session.admin,
					grados: req.session.grades,
				});
			}
		});
	} else {
		res.redirect('/login');
	}
};
homeControllers.editMembers = (req, res) => {
	const Id = req.params.NIP;
	const { name, email, municipality, neighborhood, address, telephone, cel } =
		req.body;
	connection.query(
		'UPDATE Integrantes SET NombreCompleto = ?, barrio =  ?, email = ?, municipio = ?, direccion = ?, telefono = ?, celular = ? WHERE NIP = ? ',
		[name, neighborhood, email, municipality, address, telephone, cel, Id],
		(err) => {
			if (err) {
				console.log(err);
			} else {
				res.render('../views/hometools/HomeMembersHistory.ejs', {
					admin: req.session.admin,
					members: req.session.Members,
					admin: req.session.admin,
					members: req.session.Members,
					alert: true,
					alertTitle: 'Editado',
					alertMessage: 'EL usuario ha sido editado',
					alertIcon: 'success',
					showConfirmButton: false,
					ruta: 'Home/membersHistory',
				});
			}
		}
	);
};
homeControllers.membersHistoryView = (req, res) => {
	if (req.session.loggedin && req.session.admin) {
		connection.query('SELECT * FROM Integrantes', (err, results) => {
			if (err) {
				console.log(err);
			} else {
				req.session.Members = results;
				res.render('../views/hometools/HomeMembersHistory.ejs', {
					admin: req.session.admin,
					members: req.session.Members,
				});
			}
		});
	} else {
		res.redirect('/login');
	}
};
homeControllers.registerstudent = async (req, res) => {
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
		async (err, results) => {
			if (err) {
				console.log(err);
			} else {
				if (results[0]) {
					res.render('../views/hometools/HomeRegisterUser.ejs', {
						admin: req.session.admin,
						alert: true,
						alertTitle: 'Error',
						alertMessage: 'El miembro ya se encuentra registrado',
						alertIcon: 'error',
						showConfirmButton: false,
						ruta: 'Home/student',
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
							EstadoMiembro: 1,
						},
						async (err) => {
							if (err) {
								console.log(err);
							} else {
								connection.query(
									'INSERT INTO users SET ?',
									{
										NIP: document,
										User: 'Usuario sin crear',
										SuperUser: 0,
									},
									(err) => {
										if (err) {
											console.log(err);
										} else {
											res.render(
												'../views/hometools/HomeRegisterUser.ejs',
												{
													admin: req.session.admin,
													alert: true,
													alertTitle: 'Registrado',
													alertMessage:
														'El registro de miembro ha sido exitoso',
													alertIcon: 'success',
													showConfirmButton: false,
													ruta: 'Home/student',
												}
											);
										}
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

homeControllers.registergrade = async (req, res) => {
	const { grado, grupo } = req.body;
	connection.query(
		'SELECT * FROM Grados WHERE grado = ?',
		[grado],
		async (err, results) => {
			if (err) {
				console.log(err);
			} else {
				if (results.length === 0) {
					if (grupo != undefined) {
						connection.query(
							'SELECT * FROM grados WHERE grado = ?',
							grado + '-' + grupo,
							async (err, results) => {
								if (err) {
									console.log(err);
								} else {
									if (results.length === 0) {
										connection.query(
											'INSERT INTO grados SET ?',
											{
												Grado: grado + '-' + grupo,
												AporteTotal: 0,
												CantidadProductos: 0,
											},
											async (err, results) => {
												if (err) {
													console.log(err);
												} else {
													res.render(
														'../views/hometools/HomeRegisterGrade.ejs',
														{
															admin: req.session
																.admin,
															grados: req.session
																.grades,
															alert: true,
															alertTitle:
																'Registro exitoso',
															alertMessage:
																'El grado se ha registrado correctamente',
															alertIcon:
																'success',
															showConfirmButton: false,
															ruta: 'Home/grade',
														}
													);
												}
											}
										);
									} else {
										res.render(
											'../views/hometools/HomeRegisterGrade.ejs',
											{
												admin: req.session.admin,
												grados: req.session.grades,
												alert: true,
												alertTitle: 'Grupo registrado',
												alertMessage:
													'El grado ya se encuentra registrado',
												alertIcon: 'error',
												showConfirmButton: false,
												ruta: 'Home/grade',
											}
										);
									}
								}
							}
						);
					} else {
						connection.query(
							'SELECT * FROM grados WHERE grado LIKE ?',
							'%' + grado + '%',
							async (err, results) => {
								console.log(results);
								if (err) {
									console.log(err);
								} else {
									if (results.length === 0) {
										connection.query(
											'INSERT INTO grados SET ?',
											{
												Grado: grado,
												AporteTotal: 0,
												CantidadProductos: 0,
											},
											async (err, results) => {
												if (err) {
													console.log(err);
												} else {
													res.render(
														'../views/hometools/HomeRegisterGrade.ejs',
														{
															admin: req.session
																.admin,
															grados: req.session
																.grades,
															alert: true,
															alertTitle:
																'Registro exitoso',
															alertMessage:
																'El grado se ha registrado correctamente',
															alertIcon:
																'success',
															showConfirmButton: false,
															ruta: 'Home/grade',
														}
													);
												}
											}
										);
									} else {
										res.render(
											'../views/hometools/HomeRegisterGrade.ejs',
											{
												admin: req.session.admin,
												grados: req.session.grades,
												alert: true,
												alertTitle: 'Grado registrado',
												alertMessage:
													'El grado ya se encuentra registrado o no puede ser un unico grado',
												alertIcon: 'error',
												showConfirmButton: false,
												ruta: 'Home/grade',
											}
										);
									}
								}
							}
						);
					}
				} else {
					res.render('../views/hometools/HomeRegisterGrade.ejs', {
						admin: req.session.admin,
						grados: req.session.grades,
						alert: true,
						alertTitle: 'Unico grupo',
						alertMessage:
							'El grado se encuentra registrado como unico grupo',
						alertIcon: 'error',
						showConfirmButton: false,
						ruta: 'Home/grade',
					});
				}
			}
		}
	);
};

homeControllers.deletegrade = async (req, res) => {
	const idgrado = req.params.IdGrado;
	console.log(idgrado);
	connection.query(
		'DELETE FROM Grados WHERE IdGrado = ?',
		[idgrado],
		(err) => {
			if (err) {
				console.log(err);
			} else {
				res.render('../views/hometools/HomeRegisterGrade.ejs', {
					admin: req.session.admin,
					grados: req.session.grades,
					alert: true,
					alertTitle: 'Se ha borrado exitosamente',
					alertMessage: 'El grado se ha eliminado',
					alertIcon: 'success',
					showConfirmButton: false,
					ruta: 'Home/grade',
				});
			}
		}
	);
};

homeControllers.updategrade = async (req, res) => {
	const idgrado = req.params.IdGrado,
		{ meses, dinero } = req.body;
	connection.query(
		'INSERT INTO AportesMonetarios SET ?',
		{
			Idgrado: idgrado,
			Dinero: dinero,
			Mes: meses,
		},
		(err) => {
			if (err) {
				console.log(err);
			} else {
				connection.query(
					'SELECT * FROM AportesMonetarios WHERE IdGrado = ?',
					[idgrado],
					async (err, results) => {
						if (err) {
							console.log(err);
						} else {
							let sumatoria = 0;
							console.log(results);
							for (let i = 0; i < results.length; i++) {
								sumatoria += results[i].Dinero;
							}
							connection.query(
								'UPDATE Grados SET AporteTotal = ? WHERE IdGrado = ?',
								[sumatoria, idgrado],
								async (err, results) => {
									if (err) {
										console.log(err);
									} else {
										res.render(
											'../views/hometools/HomeRegisterGrade.ejs',
											{
												admin: req.session.admin,
												grados: req.session.grades,
												alert: true,
												alertTitle: 'Aporte añadido',
												alertMessage:
													'Se ha agregado el aporte correctamente',
												alertIcon: 'success',
												showConfirmButton: false,
												ruta: 'Home/grade',
											}
										);
									}
								}
							);
						}
					}
				);
			}
		}
	);
};

homeControllers.charts = async (req, res) => {
	if (req.session.loggedin && req.session.admin) {
		const dataCharts = (Query) => {
			return new Promise((resolve, reject) => {
				connection.query(Query, (err, results) => {
					if (err) {
						return reject(err);
					} else {
						resolve(results);
					}
				});
			});
		};
		const SumdataCharts = (
			Query,
			conditional1,
			conditional2 = conditional1
		) => {
			return new Promise((resolve, reject) => {
				connection.query(
					Query,
					[conditional1, conditional2],
					(err, results) => {
						if (err) {
							return reject(err);
						} else {
							resolve(results);
						}
					}
				);
			});
		};

		const dataChartsConditional = (Query, conditional) => {
			return new Promise((resolve, reject) => {
				connection.query(Query, conditional, (err, results) => {
					if (err) {
						return reject(err);
					} else {
						resolve(results);
					}
				});
			});
		};

		const separarDatosProd = (obj) => {
			let etiquetas = [],
				valores = [],
				total = [];
			for (let i = 0; i < obj.length; i++) {
				etiquetas.push(obj[i].Grado);
				valores.push(obj[i].CantidadProductos);
			}
			total = [etiquetas, valores];
			return total;
		};
		const separarDatosAportes = (obj) => {
			let etiquetas = [],
				valores = [],
				total = [];
			for (let i = 0; i < obj.length; i++) {
				etiquetas.push(obj[i].Grado);
				valores.push(obj[i].AporteTotal);
			}
			total = [etiquetas, valores];
			return total;
		};

		// let tiempoTranscurrido = Date.now(),
		// 	hoy = new Date(tiempoTranscurrido);
		// const month = hoy.getMonth() + 1;

		const meses = [
			'01',
			'02',
			'03',
			'04',
			'05',
			'06',
			'07',
			'08',
			'09',
			'10',
			'11',
			'12',
		];
		let sumaAporteMeses = [];
		for (const mes of meses) {
			sumaAporteMes = await SumdataCharts(
				'SELECT SUM(Dinero) AS ? FROM aportesmonetarios WHERE MES = ?',
				mes
			);
			if (sumaAporteMes[0][mes]) {
				sumaAporteMeses.push(sumaAporteMes[0][mes]);
			} else {
				sumaAporteMeses.push(0);
			}
		}
		const mercadoEntregados = await dataCharts(
			'SELECT COUNT(*) AS contador FROM mercados WHERE Entregado = 1'
		);
		mercadosEntregado = mercadoEntregados[0].contador;

		let productosGrupo = await dataCharts(
			'SELECT Grado, CantidadProductos FROM grados ORDER BY CantidadProductos DESC LIMIT 5'
		);

		let usuariosSinCrear = await dataChartsConditional(
			'SELECT COUNT(*) AS NotUser FROM users WHERE User =?',
			'Usuario sin crear'
		);
		let usuarios = await dataChartsConditional(
			'SELECT COUNT(*) AS users FROM users WHERE User NOT IN (?)',
			'Usuario sin crear'
		);

		let aportestotal = await dataCharts(
			'SELECT Grado, AporteTotal FROM grados ORDER BY AporteTotal DESC LIMIT 5'
		);
		let aportesPorGrupo = separarDatosAportes(aportestotal);
		const labelAportes = aportesPorGrupo[0],
			valoresAportes = aportesPorGrupo[1];

		usuariosSinCrear = usuariosSinCrear[0].NotUser;
		usuarios = usuarios[0].users;

		let productosPorGrupo = separarDatosProd(productosGrupo);
		const labelProductos = productosPorGrupo[0],
			valoresProductos = productosPorGrupo[1];

		res.render('../views/hometools/HomeCharts.ejs', {
			admin: req.session.admin,
			mes: meses,
			contador: mercadosEntregado,
			labelAportes: labelAportes,
			valoresAportes: valoresAportes,
			sumatoriaMeses: sumaAporteMeses,
			labelProductos: labelProductos,
			valoresProductos: valoresProductos,
			user: usuarios,
			notUser: usuariosSinCrear,
		});
	} else {
		res.redirect('/login');
	}
};

module.exports = homeControllers;
