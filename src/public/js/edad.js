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

module.exports = edad;
