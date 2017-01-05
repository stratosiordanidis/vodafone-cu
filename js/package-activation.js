'use strict';




var _dimUnderlayTimer = null;

// state: ['normal', 'warning', 'thankyou', 'loading']
function setPackageActivationState(theState)
{
	var $ui = $('#package-activation-flow');

	if (theState == 'loading')
	{
		$ui.addClass('loading');
		return;
	}

	$ui
		.removeClass('normal')
		.removeClass('warning')
		.removeClass('thankyou')
		.removeClass('loading')
		;

	if (theState)
		$ui.addClass(theState);
}


// initialState: ['normal', 'warning', 'thankyou']
function openPackageActivationUI(initialState)
{
	if (_dimUnderlayTimer)
	{
		clearTimeout(_dimUnderlayTimer);
		_dimUnderlayTimer = null;
	}

	// showDimUnderlay(1000, closePackageActivationUI);
	var $ui = $('#package-activation-flow');
	setPackageActivationState(initialState)

	$ui.css('z-index', '1100');
	$('html').addClass('show-package-activation');

	function _packageActivationClickHandler(e)
	{
		var $target = $(e.target);
		var id = $target.attr('id') || '';

		if (id == 'package-activation-flow')
		{
			e.preventDefault();
			e.stopImmediatePropagation();
			closePackageActivationUI();
			return;
		}
	}
	$ui.off('click').on('click', _packageActivationClickHandler);

	var hash = window.location.hash || '';
	if ( strStartsWith(hash, '#?')==false )
		hash = '#';
	if (hash.indexOf('?panel=package-activation-flow') < 0)
	{
		hash += '?panel=package-activation-flow';
		// window.location.hash = hash;
		history.pushState(null, null, hash);
		$(window).trigger("hashchange");
	}
}


function closePackageActivationUI()
{
	if (_dimUnderlayTimer)
	{
		clearTimeout(_dimUnderlayTimer);
		_dimUnderlayTimer = null;
	}

	$('html').removeClass('show-package-activation');
	// hideDimUnderlay();

	var hash = window.location.hash || '';
	if (hash.indexOf('?panel=package-activation-flow') > -1)
	{
		hash = hash.replace('?panel=package-activation-flow', '');
		if (hash === '#')
			hash = '';

		// history.replaceState(null, document.title, hash);
		history.replaceState("", document.title, window.location.pathname + window.location.search);

		// window.location.hash = hash;
		// $(window).trigger("hashchange");
	}



	_dimUnderlayTimer = setTimeout(function()
	{
		var $ui = $('#package-activation-flow');
		$ui.css('z-index', '');

		_dimUnderlayTimer = null;	
	}, 
	300);
}



function setPackageActivationParams(params)
{
	var $ui = $('#package-activation-flow');
	if (typeof params.packageName !== 'undefined')
	{
		$ui.find('.main-area > .subtitle').text(params.packageName);
		$ui.find('.warning-case > .detail > p:first > b').text(params.packageName);
		$ui.find('.thankyou-case > .detail > p:first > b').text(params.packageName);
	}
	if (typeof params.packagePrice !== 'undefined')
	{
		$ui.find('.main-area > .price').text(params.packagePrice);
	}
	if (typeof params.normalRemaining !== 'undefined')
	{
		$ui.find('.normal-case > .detail:first > p:first > b').text(params.normalRemaining);
	}
	if (typeof params.warningRemaining !== 'undefined')
	{
		$ui.find('.warning-case > .detail:first > p:last > span').text(params.warningRemaining);
	}
	if (typeof params.thankyouRemaining !== 'undefined')
	{
		$ui.find('.thankyou-case > .detail:last > p:last > span').text(params.thankyouRemaining);
	}
}





// Example
function Example()
{
	setPackageActivationParams(
	{
		packageName: 'Smurf & Email 100',
		packagePrice: '€15,05',
		normalRemaining: '5MB',
		warningRemaining: '€0,15',
		thankyouRemaining: '€8,07'
	});


	openPackageActivationUI('warning');
	// openPackageActivationUI();

	$('#package-activation-flow > .panel-content > .warning-case.case > .choices > .choice.first > a')
		.off('click')
		.on('click',
			function(e)
			{
				setPackageActivationState('loading');
			});

}














