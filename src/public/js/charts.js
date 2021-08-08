const convertirArr = (arr) => {
	return arr.split((sep = ','));
};

const sumatoriaMeses = convertirArr('<%= sumatoriaMeses %>');
(meses = convertirArr('<%= mes %>')),
	(productoslabel = convertirArr('<%= labelProductos %>')),
	(productosValues = convertirArr('<%= valoresProductos %>')),
	(aporteLabel = convertirArr('<%= labelAportes %>')),
	(aporteValue = convertirArr('<%= valoresAportes %>'));

const labels = [1, 2, 3, 4, 5, 6, 7, 12, 34, 45];
const data = {
	labels: ['Usuarios', 'No usuarios'],
	datasets: [
		{
			label: 'Aportes monetarios mensuales',
			data: [Number('<%= user %>'), Number('<%= notUser %>')],
			fill: false,
			backgroundColor: [
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 99, 132, 0.2)',
			],
			borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
			tension: 0.1,
		},
	],
};

const config = {
	type: 'pie',
	data: data,
};
const config2 = {
	type: 'line',
	data: {
		labels: meses,
		datasets: [
			{
				label: 'MESES',
				data: sumatoriaMeses,
				fill: false,
				backgroundColor: 'rgb(50, 205, 50, 0.2)',
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1,
			},
		],
	},
};

const config3 = {
	type: 'bar',
	data: {
		labels: productoslabel,
		datasets: [
			{
				label: 'Productos',
				data: productosValues,
				fill: false,
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1,
			},
		],
	},
};

const config4 = {
	type: 'bar',
	data: {
		labels: aporteLabel,
		datasets: [
			{
				label: 'Aporte monetario',
				data: aporteValue,
				fill: false,
				backgroundColor: 'rgba(50, 205, 50, 0.2)',
				borderColor: 'rgba(50, 205, 50, 1)',
				borderWidth: 1,
			},
		],
	},
};

const myChart = new Chart(document.getElementById('myChart'), config);
const myChart2 = new Chart(document.getElementById('myChart2'), config2);
const myChart3 = new Chart(document.getElementById('myChart3'), config3);
const mychart4 = new Chart(document.getElementById('myChart4'), config4);
