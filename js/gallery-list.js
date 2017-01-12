'use strict';


function galleryListAlignImages()
{
	$('.gallery-list').each(function(index, el)
	{
		var $el = $(el);

		// var $img = $el.children('.img');
		var $img = $el.children('figure');
		var parent_offset = $el.offset();

		$img
			.removeClass('even')
			.removeClass('odd')
			;

		var img_height = $img.first().height() || 0;

		$img.each(function(idx, element)
		{
			var $this = $(element);

			var offset = $this.offset();

			var diff = offset.top - parent_offset.top;

			diff -= 10; // for safety

			var row = Math.floor(diff / img_height);

			if (row & 1)
			{
				$this.addClass('even');
			}
			else
			{
				$this.addClass('odd');
			}

		});
	});
	
}

function setupGalleryList()
{


	// $gallery.on('init', function(event, slick){
	function _galleryCounterInit(event, slick)
	{
		// slideCount = slick.slideCount;
		_setSlideCount(slick.slideCount);
		_setCurrentSlideNumber(slick.currentSlide);
	}

	// $gallery.on('beforeChange', function(event, slick, currentSlide, nextSlide){
	function _galleryCounterBeforeChange(event, slick, currentSlide, nextSlide)
	{
		_setCurrentSlideNumber(nextSlide);
	}

	function _setSlideCount(count) 
	{
		var $el = $('.gallery-slide-count').find('.total');
		$el.text(count);
	}

	function _setCurrentSlideNumber(currentSlide) 
	{
		var $el = $('.gallery-slide-count').find('.current');
		$el.text(currentSlide + 1);
	}


	if ( $('.gallery-list').length > 0 )
	{
		$('.gallery-list figure').on('click', function(e)
		{
			var $el = $(e.target);
			var $galleryList = $el.closest('.gallery-list');

			$('html').addClass('show-gallery');

			var $galleryUnderlay = $('#gallery-underlay');

			$galleryUnderlay.find('.gallery-list').empty();

			var $clone = $galleryList.children().clone();

			// take care of the thumbnails
			$clone.off('click');
			$clone.each(function(index, el)
			{
				var $el = $(el);
				var $img = $el.find('img').clone();
				$img.addClass('grayscale');
				$el.find('img').first().after($img);
				if ($.fn.gray)
				{
					$el.children('.grayscale').gray();
				}
			});
			$galleryUnderlay.find('.thumbnail-list').append($clone);

			//=====================

			var $thumbs = $galleryUnderlay.find('.thumbnail-list').first();

			// var slide_width = $thumbs.children().first().outerWidth(true);
			// console.log('slide_width: '+slide_width);

			// $thumbs.children().each(function(index, el)
			// {
			// 	// var slide_width = $(el).outerWidth(true);
			// 	var slide_width = $(el).width();
			// 	console.log('slide_width: '+slide_width);

			// });

			// hide it before making it a carousel 
			// because it calcs the wrong figure width 
			$thumbs.css('visibility', 'hidden');
			$thumbs.slick({
				fitToSlides: true,
				alignCenter: true,
				dots: false,
				arrows: false,
				variableWidth: true,
				centerMode: true,
				focusOnSelect: true,
				// slidesToScroll: 1,
				infinite: false,
				// swipe: true,
				swipe: false,
				asNavFor: '#gallery-underlay .gallery-list'
			});

			// $thumbs.find('.slick-track').css('width', '');
			// $thumbs.find('figure').css('width', '');
			// $galleryUnderlay.find('.thumbnail-list').first()[0].slick.setDimensions();
			// $galleryUnderlay.find('.thumbnail-list').first()[0].slick.refresh();
			// $galleryUnderlay.find('.thumbnail-list').first()[0].slick.setPosition();

			setTimeout(function()
			{
				// must refresh after a small delay
				// so that the images inside the figures will have loaded
				// $thumbs[0].slick.refresh();	
				$thumbs.slick('refresh');
				$thumbs.css('visibility', '');
			}, 0);

			//=====================

			// take care of the big images
			$clone = $galleryList.children().clone();
			$clone.off('click');
			$clone.each(function(index, el)
			{
				var $el = $(el);
				var $img = $el.find('img');

				$img.removeAttr('src');
				var src = $img.parent().attr('data-big-size-url') || '';
				$img.attr('data-lazy', src);
				$el.children().wrapAll('<div class="wrapper"></div>');
			});
			$galleryUnderlay.find('.gallery-list').append($clone);

			$galleryUnderlay.find('.gallery-list').first()
				.on('init', _galleryCounterInit)
				.on('beforeChange', _galleryCounterBeforeChange)
				;

			$galleryUnderlay.find('.gallery-list').first().slick({
				slidesToShow: 1,
				lazyLoad: 'ondemand',
				fitToSlides: false,
				alignCenter: false,
				centerMode: true,
				focusOnSelect: true,
				dots: false, //true,
				arrows: true,
				slidesToScroll: 1,
				infinite: false,
				swipe: true,
				asNavFor: '#gallery-underlay .thumbnail-list'
			});

			setTimeout(function()
			{
				// must refresh after a small delay
				// so that the images inside the figures will have loaded
				$galleryUnderlay.find('.gallery-list').first().slick('refresh');
				// $thumbs.css('visibility', '');
			}, 0);


		});


		$('#gallery-underlay > .close-button').on('click', function(e)
		{
			$('html').removeClass('show-gallery');
			setTimeout(function()
			{
				$('#gallery-underlay .thumbnail-list').slick('unslick');
				$('#gallery-underlay .thumbnail-list').empty();
				$('#gallery-underlay .gallery-list').slick('unslick');
				$('#gallery-underlay .gallery-list').empty();
			}, 310);
		});


		galleryListAlignImages();
		$(window).on('resize', throttle(galleryListAlignImages, 150) );
	}
}


$(document).ready(function()
{
	setupGalleryList();
});