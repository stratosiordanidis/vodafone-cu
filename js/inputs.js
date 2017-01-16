'use strict';

function setupInputs()
{
	$('input')
		.on('focus', function(e)
		{
			$(this).addClass('focused');
		})
		.on('blur', function(e)
		{
			var $this = $(this);
			var val = $(this).val() || '';
			val = val.trim();
			if (val.length > 0)
				$this.addClass('has-value');
			else
				$this.removeClass('has-value');
			$this.removeClass('focused');
		})
	;
}


$(document).ready(function(){
	setupInputs();
});