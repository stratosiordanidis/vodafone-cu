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
			$carousel.each(function(index, el) {
				if (el.slick)
				{
					el.slick.setPosition();
				}
			});
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


$(document).ready(function()
{
	setupChoices();
	// setupMobilePanels();
});


