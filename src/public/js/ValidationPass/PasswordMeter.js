let password = document.getElementById('pass');

password.addEventListener('keyup', function () {
	let passwordArray = password.value.split('');
	let totalScore = 0;

	let rating = {
		number: 0,
		lowercase: 0,
		uppercase: 0,
		specialChar: 0,
		total: 0,
	};

	let validation = {
		isNumber: function (val) {
			let pattern = /^\d+$/;
			return pattern.test(val);
		},
		isLowercase: function (val) {
			let pattern = /[a-z]/;
			return pattern.test(val);
		},
		isUppercase: function (val) {
			let pattern = /[A-Z]/;
			return pattern.test(val);
		},
		isSpecialChar: function (val) {
			let pattern = /^[!@#\$%\^\&*\)\(+=._-]+$/g;
			return pattern.test(val);
		},
	};

	for (let i = 0; i < passwordArray.length; i++) {
		if (validation.isNumber(passwordArray[i])) {
			rating.number = 1;
		} else if (validation.isLowercase(passwordArray[i])) {
			rating.lowercase = 1;
		} else if (validation.isUppercase(passwordArray[i])) {
			rating.uppercase = 1;
		} else if (validation.isSpecialChar(passwordArray[i])) {
			rating.specialChar = 1;
		}
	}

	function assessTotalScore() {
		let ratingElement = document.querySelector('.rating');
		let message = document.querySelector('.MessagePass');
		rating.total =
			rating.number +
			rating.lowercase +
			rating.uppercase +
			rating.specialChar;

		if (rating.total === 1) {
			message.innerHTML = 'Debil';
			message.classList.remove('moderateMessage', 'strongMessage');
			message.classList.add('weakMessage');

			ratingElement.classList.remove(
				'moderatePassword',
				'strongPassword'
			);
			ratingElement.classList.add('weakPassword');
		} else if (rating.total === 2) {
			message.innerHTML = 'Moderada';
			message.classList.remove('weakMessage', 'strongMessage');
			message.classList.add('moderateMessage');

			ratingElement.classList.remove('weakPassword', 'strongPassword');
			ratingElement.classList.add('moderatePassword');
		} else if (rating.total === 3) {
			message.innerHTML = 'Fuerte';
			message.classList.remove('weakMessage', 'moderateMessage');
			message.classList.add('strongMessage');

			ratingElement.classList.remove('weakPassword', 'moderatePassword');
			ratingElement.classList.add('strongPassword');
		}
	}

	assessTotalScore();
});
