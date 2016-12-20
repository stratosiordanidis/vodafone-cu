'use strict'


function findClass($el, className)
{
	var classes = ($el.attr('class') || '').split(' ');
	var choiceClass = null;
	for (var i = 0; i < classes.length; i++)
	{
		if ( classes[i].indexOf('choice-') > -1 )
		{
			choiceClass = classes[i];
			break; // for loop
		}
	}

	return choiceClass;
}

function setupChoices()
{
	$('.mobile-header > .back-button').on('click', function(e)
	{
		var $this = $(this);
		var $open = $this.closest('.open');

		$open.removeClass('open');
	});

	$('.choice').on('click', function(e)
	{
		var $this = $(this);
		var wasActive = $this.hasClass('active');

		function excludePermanent()
		{
			return $(this).closest('.permanent').length == 0;
		}

		var $parent = $this.parent();
		$parent.find('.choice.active, .option.active').removeClass('active');
		// $parent.find('.choice.active, .option.active').removeClass('active');

		var $section = $parent.closest('.choices-section');

		var choiceClass = findClass($section, 'choice-');
		if (choiceClass)
		{
			$section.removeClass(choiceClass);
		}

		choiceClass = findClass($section, 'choice-');
		if (choiceClass)
		{
			$section.removeClass(choiceClass);
		}
		$('.choices-section .choice.active').filter(excludePermanent).removeClass('active');
		$('.options-section').removeClass('open');

		if (wasActive)
			return;

		choiceClass = findClass($this, 'choice-');
		if (choiceClass)
		{
			$this.addClass('active');
			$section.addClass(choiceClass);
			var $next = $section.next();
			$next.find('.option.active').filter(excludePermanent).removeClass('active');
			$next.addClass('open');
			var $wrapper = $next.children('.section-wrapper');
			$wrapper.children('.choice').remove();
			// $wrapper.prepend( $this.clone() );
			$wrapper.children('.mobile-only').first().after( $this.clone().removeClass('slick-slide') );

			var option = choiceClass.replace('choice-', 'option-');
			var $option = $next.find( '.'+option );
			$option.addClass('active');
			var $carousel = $option.find('.slick-initialized');
			// if ( $carousel.length > 0 )
			// {
			// 	$carousel.each(function(index, el)
			// 		{
			// 			el.slick.refresh();
			// 		});
			// }
		}
	});

	$('.pare-naxeis-section.choices-section .choice').on('click', function(e)
	{
		var $this = $(this);
		var $fillin = $this.find('.fill-in-data');
		var $parent = $this.closest('.pare-naxeis-section.choices-section');
		var $options = $parent.next();
		var $inputs = $options.find('form input[type="text"]');

		$inputs.each(function(index, el)
		{
			var $el = $(el);

			var name = $el.attr('name') || '';
			var data = $fillin.attr('data-'+name) || '';
			data = data.trim();

			$el.val( data );
			if ( data.length > 0 )
				$el.addClass('has-value');
			else
				$el.removeClass('has-value');
		});
	});
}


function setupMobilePanels()
{
	var activeClass = 'active';
	var prevHash = '';
	$('.mobile-layout .panel-link').on('click', function(e)
	{
		var $this = $(this);
		var href = $this.attr('href') || '';

		var $panel = $(href);

		if ($panel.length > 0)
		{
			e.preventDefault();
			// $panel.addClass('active');

			var hash = window.location.hash || '';

			if (href == '#panel-user-form')
			{
				var $fillin = $this.find('.fill-in-data');

				$(href + ' input[type="text"]').each(function(index, el)
				{
					var $el = $(el);
					var name = 'data-' + ($el.attr('name') || '');

					var data = $fillin.attr(name) || '';
					data = data.trim();
					$el.val(data);
					if (data.length > 0)
					{
						$el.addClass('has-value');
					}
					else
					{
						$el.removeClass('has-value');
					}
					// if ($fillin.length > 0)
					// {
					// }
					// else
					// {
					// 	$el.val('');
					// }
				})
			}

			var $el = $(href);

			if ($el.length > 0)
			{
				$el.find('.progress-widget > .fg-graphic').each(function(idx, el)
					{
						// setProgressArcNumber(0, el, true);

						setTimeout(function()
						{
							setProgressArcNumber(idx, el);
						}, 300);
					});
			}

			hash += href;
			if(history.pushState) 
			{
				history.pushState(null, null, hash);
				$(window).trigger("hashchange");
			}
			else 
			{
				location.hash = hash;
			}

		}
	});


	History.Adapter.bind(window, 'statechange', function() 
	{
		var state = History.getState();
		// updateContent(History.getState());
		var url = state.data.url;
		console.log('statechange '+url);
	});

	History.Adapter.bind(window, 'onanchorchange', function() 
	{
		var state = History.getState();
		// updateContent(History.getState());
		var url = state.data.url;
		console.log('onanchorchange '+url);
	});


	$(window).bind("hashchange", function(e)
	{
		console.log('hashchange '+location.hash);

		var hash = window.location.hash || '';
		$('.panel.'+activeClass).removeClass(activeClass);

		// $('#base-panel').addClass(activeClass);
		// if ( hash.length == 0 )
		// {
		// 	$('#base-panel').addClass('active');
		// }

		var parts = hash.split('#');
		var panelsOpen = 0;
		for (var i = 0; i < parts.length; i++)
		{
			if ( parts[i].length > 2 )
			{
				var $panel = $('#'+parts[i]);
				console.log('#'+parts[i]+' set to active');
				$panel.addClass(activeClass);
				panelsOpen++;	
			}
		}

		if (panelsOpen > 0)
		{
			$('html').addClass('mobile-panel-open');
		}
		else
		{
			$('html').removeClass('mobile-panel-open');
		}

		// var panelSel = parts[parts.length - 1];
		// var $panel = $(panelSel);

	});

	$('.mobile-layout .panel .nav-header .back-button').on('click', function(e)
	{
		// var $this = $(this);
		// var $panel = $this.closest('.panel');
		
		$(this).closest('.panel').find('.progress-widget > .fg-graphic').each(function(idx, el)
		{
			setProgressArcNumber(0, el, true);
		});

		// $panel.removeClass(activeClass);
		History.back();
	});

	$('.progress-widget .fg-graphic').each(function(index, el)
	{
		setProgressArcNumber(index, el);
	});

}


$(document).ready(function()
{
	setupChoices();
	setupMobilePanels();
});


