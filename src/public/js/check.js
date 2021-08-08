$(document).ready(function () {
	$('#check').prop('checked', false);
	$('#check').click(function () {
		if ($('#check').is(':checked') == true) {
			$('#grupo').prop('disabled', true);
			$('#grupo').val('');
		} else {
			$('#grupo').prop('disabled', false);
		}
	});
	$('#checkOtros').prop('checked', true);
	$('#checkOtros').click(function () {
		if ($('#checkOtros').is(':checked') == false) {
			$('#otros').prop('disabled', true);
			$('#otros').val('');
		} else {
			$('#otros').prop('disabled', false);
		}
	});
	$('#checkGranos').prop('checked', true);
	$('#checkGranos').click(function () {
		if ($('#checkGranos').is(':checked') == false) {
			$('#granos').prop('disabled', true);
			$('#granos').val('');
		} else {
			$('#granos').prop('disabled', false);
		}
	});
	$('#checkHarinas').prop('checked', true);
	$('#checkHarinas').click(function () {
		if ($('#checkHarinas').is(':checked') == false) {
			$('#harinas').prop('disabled', true);
			$('#harinas').val('');
		} else {
			$('#harinas').prop('disabled', false);
		}
	});
	$('#checkEnlatados').prop('checked', true);
	$('#checkEnlatados').click(function () {
		if ($('#checkEnlatados').is(':checked') == false) {
			$('#enlatados').prop('disabled', true);
			$('#enlatados').val('');
		} else {
			$('#enlatados').prop('disabled', false);
		}
	});
	$('#checkEmbutidos').prop('checked', true);
	$('#checkEmbutidos').click(function () {
		if ($('#checkEmbutidos').is(':checked') == false) {
			$('#embutidos').prop('disabled', true);
			$('#embutidos').val('');
		} else {
			$('#embutidos').prop('disabled', false);
		}
	});
	$('#checkAceites').prop('checked', true);
	$('#checkAceites').click(function () {
		if ($('#checkAceites').is(':checked') == false) {
			$('#aceites').prop('disabled', true);
			$('#aceites').val('');
		} else {
			$('#aceites').prop('disabled', false);
		}
	});
});
