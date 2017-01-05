'use strict';


function setupTopupRenewals()
{

	$('.box .panel').on('click', function(e)
	{
		var $target = $(e.target);

		if ( $target.hasClass('panel') )
		{
			var $box = $target.closest('.box');
			$box.removeClass('active');
		}
	});


	$('.box .payment-area > .buttons > a.cancel').on('click', function(e)
	{
		var $this = $(this);
		var $box = $this.closest('.box');
		$box.removeClass('active');		
	});


	$('.box .action-button.select').on('click', function(e)
	{
		var $this = $(this);

		var $box = $this.closest('.box');
		$box.parent().find('.active').removeClass('active');
		$box.addClass('active');
	});

	$('.box .change-email').on('click', function(e)
	{
		var $this = $(this);

		var $prev = $this.prev();
		$prev.prop('disabled', false);
		
		$prev.focus();

		// if ( $prev.hasAttr('disabled') )
		// 	$prev.removeAttr('disabled');
		// else
		// 	$prev.attr('disabled', '');
	});

	$('.box .change-buttons > .cancel').on('click', function(e)
	{
		var $this = $(this);

		var $prev = $this.parent().prev().prev();
		$prev.prop('disabled', true);
	});
}



$(document).ready(function()
{
	setupTopupRenewals();
});