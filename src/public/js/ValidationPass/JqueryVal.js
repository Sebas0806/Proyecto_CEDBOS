$(document).ready(function () {
	$('#RegisterForm').validate({
		rules: {
			user: {
				required: true,
				minlength: 5,
			},
			names: {
				required: true,
			},
			lastnames: {
				required: true,
			},
			pass: {
				required: true,
			},
			repass: {
				required: true,
				equalTo: '#pass',
			},
			Question: {
				required: true,
			},
			Answer: {
				required: true,
			},
		},
		messages: {
			user: {
				required: 'Este campo es necesario',
				minlength: 'Tu usuario debe tener mas de 5 caracteres',
			},
			names: {
				required: 'Este campo es necesario',
			},
			lastnames: {
				required: 'Este campo es necesario',
			},
			pass: {
				required: false,
			},
			repass: {
				required: 'Este campo es necesario',
				equalTo: 'No coincide los datos',
			},
			Question: {
				required: 'Este campo es necesario',
			},
			Answer: {
				required: 'Este campo es necesario',
			},
		},
	});
});
