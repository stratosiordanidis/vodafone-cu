'use strict';



function scrollToElement(el, offset, onComplete)
{
	// TweenMax(document.body, 
	// TweenMax($(window) 
	// {
	// 	duration: 0.3,
	// 	scrollTop: (el.offsetTop + offset),
	// 	onComplete: onComplete
	// });

	var topY = $(el).offset().top || 0;
	topY += (offset || 0);

	console.log('scrolling to '+topY);

	TweenMax.to($(window), 0.5, 
			{
				scrollTo:{
					y: topY, 
					autoKill: true
				}
				,ease:Power3.easeOut 
		 });
}

function setupLoginUI()
{
	$('.login-button').on('click', function(e)
	{
		var $html = $('html');

		if ( !$html.hasClass('logged-in') )
		{
			$('html').toggleClass('show-login-panel');
		}
		else
		{
			$('html').removeClass('show-login-panel');
		}
	});
}

function setupNavigationMenu()
{
	var openSubmenu = null;


	$('.nav-menu .menu-button').on('click', function(e)
	{
		$(document.body).toggleClass('open-submenu');
	});

	$('.nav-menu .level0').on('mouseenter', function(e)
	{
		console.log('.level0 mousenter triggered');
		var $this = $(this);


		if ( $this.hasClass('open')==false )
		{
			var $level1 = $('.nav-menu .level0.open').find('.level1');
			// for (var i = 0; i < $level1.length; i++)
			// {
			// }
			var delay = 0.08;
			$level1.each(function(index, el)
			{
				el.style.opacity = 0;
				// TweenMax.to(el, 0.3, {delay: ($level1.length - index+1)*delay, opacity: 0});
			});



			$(document.body).addClass('open-submenu');
			$('.nav-menu .level0.open').removeClass('open');
			$this.addClass('open');
			// console.log('adding .open class');

			var $drawer = $('.nav-menu > .submenu-drawer');

			var $submenu = $this.children('.submenu');
			openSubmenu = $submenu[0];
			
			var subHeight = $submenu.outerHeight(true) || 0;
			subHeight = subHeight > 0 ? subHeight - 20 : subHeight;
			$drawer.height(subHeight);

			var delay = 0.08 * 1000;
			$level1 = $this.find('.level1');
			$level1.each(function(index, el)
			{
				setTimeout(function()
				{
					if (openSubmenu===$submenu[0])
						el.style.opacity = 1;
				}, 
				(index+2)*delay);
				// TweenMax.to(el, 0.4, {
				// 		delay: (index+2)*delay, 
				// 		opacity: 1,
				// 		onComplete: function()
				// 		{
				// 			$('.nav-menu .level0').not('.open').find('.level1').css('opacity', '');
				// 		}
				// 	});
			});

			// for (var i = 0; i < $level1.length; i++)
			// {
			// 	TweenMax.to($level1[i], 0.2, {delay: i*delay, opacity: 1});
			// 	// setTimeout(function()
			// 	// {
			// 	// }, i*delay);
			// }
			// TweenMax.to($drawer[0], 0.3, 
			// 			{
			// 				height: subHeight,
			// 				onComplete: function()
			// 				{

			// 				}
			// 			});
		}
		
	});

	// $('.nav-menu .level0 > .menu-item').on('click', function(e)
	// {
	// 	if ( $(window).width() > 1300 )
	// 		e.preventDefault();

	// 	var $this = $(this);

	// 	if ($this.hasClass('open'))
	// 	{
	// 		$this.removeClass('open');
	// 		$(document.body).removeClass('open-submenu');
	// 	}
	// 	else
	// 	{
	// 		$this.parent().parent().find('.open').removeClass('open');
	// 		$this.addClass('open');
	// 		$(document.body).addClass('open-submenu');
	// 	}
	// });

	function _closeMenu()
	{
		if ( $(document.body).hasClass('open-submenu') )
		{
			// var delay = 0.08;
			// var $level1 = $('.nav-menu .level0.open').find('.level1');
			// $level1.each(function(index, el)
			// {
			// 	TweenMax.to(el, 0.3, {delay: ($level1.length - index+1)*delay, opacity: 0});
			// });

			// $('.nav-menu .open').removeClass('open');
			$(document.body).removeClass('open-submenu');
			var $drawer = $('.nav-menu > .submenu-drawer');
			$drawer.height(0);
			$('.nav-menu .level1').css('opacity', '');
			openSubmenu = null;
			$('.nav-menu .level0.open').removeClass('open');
			$('#click-trap-underlay').css('z-index', '');
			// console.log('removing .open class');
			// TweenMax.to($drawer[0], 0.3, {height: 0});			
		}
	}

	// $('#menu-underlay')
	$('#click-trap-underlay')
		.on('click mousemove', function(e)
	{
		_closeMenu();
	});

	function _menuOnScroll(e)
	{
		if (document.body.scrollTop > 5)
		{
			$('body').addClass('sticky-nav');
		}
		else
		{
			$('body').removeClass('sticky-nav');
		}
	}

	$(window).on('scroll', debounce(_menuOnScroll, 100));

}


function showSidebar()
{
	var $close = $('aside#sidebar > .sidebar-contents > .sidebar > .close-button');
	if ($close.length == 0)
	{
		$('aside#sidebar > .sidebar-contents > .sidebar').append('<div class="close-button"></div>');
		$close = $('aside#sidebar > .sidebar-contents > .sidebar > .close-button');
	}
	$close.off('click').on('click', closeSidebar);


	$('aside#sidebar >  .loader').css('opacity', 0);
	$('html').addClass('sidebar-finished-loading');
}

function hideSidebar()
{
	$('html').removeClass('sidebar-finished-loading');
}



// function openOfferSidebar($replaceContentsWith)
function openSidebar($replaceContentsWith)
{
	$replaceContentsWith = $replaceContentsWith || null;

	// var $sidebar = $('aside#offer-sidebar');
	var $sidebar = $('aside#sidebar > .sidebar-contents');

	$sidebar.empty();
	if ( $replaceContentsWith && $replaceContentsWith.length )
	{
		$sidebar.append( $replaceContentsWith.clone() );
	}

	var $clickTrap = $('#click-trap-underlay');
	$clickTrap
		.off('click', closeSidebar)
		.on('click', closeSidebar);

	$('html').addClass('open-sidebar');
	$sidebar.parent().css('z-index', '1000');
	$clickTrap.css('z-index', '900');

	setTimeout(function()
	{
		var $loader = $('aside#sidebar >  .loader');
		if ( $('html').hasClass('sidebar-finished-loading')==false )
		{
			$loader.css('opacity', 1);
		}
	}, 3*1000);

	// if ( $sidebar.length==0 )
	// {
	// 	$('body').append('<aside id="offer-sidebar"><div class="click-trap"></div><div class="sidebar"></div></aside>');
	// 	$sidebar = $('aside#offer-sidebar');
	// }

	// $sidebar.find('.sidebar').empty().append('<div class="side-graphic"></div>');
	// if ( $replaceContentsWith )
	// 	$sidebar.find('.sidebar').append( $replaceContentsWith.clone() );

	// var $closeButton = $('aside#offer-sidebar .sidebar > .close-button');
	// if ($closeButton.length == 0)
	// {
	// 	$sidebar.find('.sidebar').append('<div class="close-button"></div>');
	// 	$closeButton = $('aside#offer-sidebar .sidebar > .close-button');
	// 	$closeButton.off('click').on('click', closeOfferSidebar);
	// }

	// if ( $('html').hasClass('show-offer-sidebar')==false )
	// {
	// 	$sidebar.css('z-index', '1000');
	// 	$('html').addClass('show-offer-sidebar');
	// 	$sidebar.find('.click-trap').off('click').on('click', closeOfferSidebar);
	// }
}


function openSidebarIFrame(url)
{
	var $sidebar = $('#sidebar-iframe');

	$(window).one('sidebar-document.ready', function(e)
	{
		$('html').addClass('show-offer-sidebar');
	});

	$(window).one('sidebar-link', function(e)
	{
		$('html').addClass('show-offer-sidebar');
	});


	$sidebar.find('.click-trap').one('click', closeOfferSidebar);
	$sidebar.css('z-index', '1000');
	$sidebar.find('.click-trap').css('opacity', 1);

	$('#sidebar-iframe > iframe').attr('src', url);





	// $sidebar.css('z-index', '1000');




	// $replaceContentsWith = $replaceContentsWith || null;



	// $sidebar.find('.sidebar').empty().append('<div class="side-graphic"></div>');
	// if ( $replaceContentsWith )
	// 	$sidebar.find('.sidebar').append( $replaceContentsWith.clone() );

	// var $closeButton = $('aside#offer-sidebar .sidebar > .close-button');
	// if ($closeButton.length == 0)
	// {
	// 	$sidebar.find('.sidebar').append('<div class="close-button"></div>');
	// 	$closeButton = $('aside#offer-sidebar .sidebar > .close-button');
	// 	$closeButton.off('click').on('click', closeOfferSidebar);
	// }

	// if ( $('html').hasClass('show-offer-sidebar')==false )
	// {
	// 	$sidebar.css('z-index', '1000');
	// 	$('html').addClass('show-offer-sidebar');
	// 	$sidebar.find('.click-trap').off('click').on('click', closeOfferSidebar);
	// }
}


// function closeOfferSidebar()
// {
// 	if ( $('html').hasClass('show-offer-sidebar') )
// 	{
// 		var $sidebar = $('aside#offer-sidebar');
// 		$sidebar.find('.click-trap').off('click');
// 		$('html').removeClass('show-offer-sidebar');
// 		setTimeout(function()
// 		{
// 			$sidebar.css('z-index', '');
// 		}
// 		, 300);
// 	}
// }


function closeSidebar()
{
	if ( $('html').hasClass('open-sidebar') )
	{
		var $sidebar = $('aside#sidebar > .sidebar-contents');

		// var $sidebar = $('aside#offer-sidebar');
		// $sidebar.find('.click-trap').off('click');
		// $('html').removeClass('show-offer-sidebar');
		
		var $clickTrap = $('#click-trap-underlay');
		$clickTrap
			.off('click', closeSidebar)
			;

		hideSidebar();
		$('html').removeClass('open-sidebar');
		$('html').removeClass('sidebar-finished-loading');
		$('aside#sidebar >  .loader').css('opacity', 0);

		History.back();

		setTimeout(function()
		{
			// $sidebar.css('z-index', '');
			// 
			$sidebar.parent().css('z-index', '1000');
			$clickTrap.css('z-index', '');
		}
		, 300);
	}
}


function setupSidebar()
{
	setupSidebarRouter();

	$(window).on('sidebar-loaded', function(e)
	{
		showSidebar();
	});
}


function setupHeaderCarousel()
{
	var $header = $('.header-carousel > .carousel');
	if ($header.length == 0)
		return;

	var changeEvent = 'beforeChange';//'afterChange';

	function _handleHeaderCarouselChange(event, slick, currentSlide, nextSlide)
	{
		var $current = $(event.target).find('.slick-track > .slick-current');

		var $oldInfo = $(event.target).closest('.header-carousel').children('.info-holder');
		var $info = $current.find('.info-wrapper');

		var $carousel = $oldInfo.closest('.header-carousel');

		if ($info.length > 0)
		{
			$info = $info.clone();
			$carousel.removeClass('slide-has-no-info');
		}
		else
		{
			$carousel.addClass('slide-has-no-info');
		}

		function registerSidebarActionButton($obj)
		{
			$obj.on('click', function(e)
			{
				var $this = $(this);

				var $infowrapper = $this.closest('.info-holder');
				var $sidebarinfo = $infowrapper.find('.sidebar-info');

				if ( $sidebarinfo.length == 0 )
					$sidebarinfo = null;

				openOfferSidebar( $sidebarinfo.children() );
			});
		}

		if ($oldInfo.length > 0)
		{
			TweenMax.to($oldInfo[0], 0.3, {opacity: 0, 
				onComplete:function()
				{
					$oldInfo.empty();

					if ($info.length > 0)
					{
						var has_bg_color = ($info.attr('style') || '').indexOf('background-color') > -1;
						var bg_color = 	has_bg_color ? $info.css('background-color') : null;
						var classes = 'info-holder ' + ($info.attr('class') || '').replace('info-wrapper', '');
						$oldInfo.attr('class', classes);
						$oldInfo.append($info.children());
						registerSidebarActionButton($oldInfo.find('.fg > .block > .action-button'));
						if (bg_color)
						{
							$oldInfo.find('.bg, .fg').css('background-color', bg_color);
							$oldInfo.find('.fg span').css('color', bg_color);
							$oldInfo.find('.fg .action-button')
										.css('border-color', bg_color)
										.css('background-color', bg_color);
						}
						TweenMax.to($oldInfo[0], 0.3, {opacity: 1});
					}
				}}
			);
		}
		else
		{
			if ($info.length > 0)
			{
				var has_bg_color = ($info.attr('style') || '').indexOf('background-color') > -1;
				var bg_color = 	has_bg_color ? $info.css('background-color') : null;
				var classes = 'info-holder ' + ($info.attr('class') || '').replace('info-wrapper', '');
				$oldInfo.attr('class', classes);
				$oldInfo.append($info.children());
				// registerSidebarActionButton($oldInfo.find('.action-button'));
				registerSidebarActionButton($oldInfo.find('.fg > .block > .action-button'));
				if (bg_color)
				{
					$oldInfo.find('.bg, .fg').css('background-color', bg_color);
					$oldInfo.find('.fg span').css('color', bg_color);
					$oldInfo.find('.fg .action-button')
								.css('border-color', bg_color)
								.css('background-color', bg_color);

				}
				TweenMax.to($oldInfo[0], 0.3, {opacity: 1});
			}			
		}
	}

	if ($.fn.slick)
	{
		$header.slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			// variableWidth: true,
			infinite: true,
			fitToSlides: false,
			alignCenter: false,
			arrows: false,
			dots: true, 
			pauseOnHover: true,
			// autoplay: true,
			autoplaySpeed: 5000
		});

		_handleHeaderCarouselChange({target: $header[0]});

		$header.on(changeEvent, function(event, slick, currentSlide, nextSlide) { setTimeout(function(){_handleHeaderCarouselChange(event, slick, currentSlide, nextSlide); }); });
	}
}


function setProgressArcNumber(idx, el, reset)
{
	var delay_gap = 200;

	var $el = $(el);
	var $number = $el.parent().find('.number').first();
	var num = $number.attr('data-num') || parseFloat( $number.text() ) || 0;
	var max = $number.attr('data-max') || 0;
	max = parseFloat(max);
	var t = (num / max) || 0;
	t = Math.max(0, t);
	t = Math.min(1, t);

	var bar = null;
	var dashPixels = 0;
	if ($el[0].nodeName === 'OBJECT')
	{
		var svg = el.contentDocument;
		if (svg)
			bar = svg.getElementById('progress-arc') || svg.querySelector('.progress-arc');
	}
	else
	{
		bar = $el.find('.progress-arc').first();
		if (bar.length > 0)
			bar = bar[0];
	}
	if (!bar)
		return;
	dashPixels = $(bar).css('stroke-dasharray');//bar.getAttribute('stroke-dasharray');
	dashPixels = parseFloat(dashPixels) || 0;
	var offset = t * dashPixels;

	if (isIE)
		$(bar).css('stroke-dashoffset', ''+offset);
	else
	{
		setTimeout(function(){ 
			// bar.setAttribute('stroke-dashoffset', ''+offset); 
			// $(bar).css('stroke-dashoffset', ''+offset);
			if (reset)
				TweenMax.set(bar, {'stroke-dashoffset': dashPixels+'px', duration: 0});
			else
				TweenMax.set(bar, {'stroke-dashoffset': offset+'px'});
			// TweenMax.set(bar, {'stroke-dashoffset': offset});
		}, idx * delay_gap);
	}
}


function setupUserInfoDashboard()
{
	var $board = $('.user-info-dash-board');
	if ($board.length == 0)
		return;

	var delay_gap = 200;

	$board.each(function(index, element)
	{
		var $this = $(element);

		$this.find('.progress-widget > .fg-graphic').each(function(idx, el)
			{
				setProgressArcNumber(idx, el);
			});

	});

	$board.find('.active-packages-col .carousel').each(function(index, el)
	{
		var $el = $(el);
		$el.slick({
			slidesToShow: (isMobile ? 1 : 2),
			slidesToScroll: 1,
			infinite: true,
			fitToSlides: false,
			alignCenter: false,
			arrows: false,
			dots: true
		});
	});

	$board.find('.mobile-only > .columns > .col').on('click', function(e)
	{
		e.preventDefault();
		var $this = $(this);

		var parts = $this.attr('class').split(' ');
		var foundClass = null;
		for (var i = 0; i < parts.length; i++)
		{
			if (parts[i].indexOf('-col') > -1)
			{
				foundClass = parts[i];
				break; // for loop
			}
		}

		if (foundClass)
		{
			$this.closest('.mobile-only').find('.active').removeClass('active');
			$this.addClass('active');
			var $tabs = $this.closest('.mobile-only').find('.tabs');
			$tabs.find('.active').removeClass('active');
			$tabs.find('.'+foundClass).addClass('active');
		}
	});
}

function setupArticleBoxes()
{
	// if (!isMobile)
	{
		// var $titles = $('.article-box:not(.fullwidth) > .fg > .text-wrapper > .title');
		var $titles = $('.article-box > .fg > .text-wrapper > .title');
		var $details = $('.article-box > .fg > .text-wrapper > .detail');
		if ($.fn.dotdotdot)
		{
			if (isMobile)
				$titles.dotdotdot({ height: 26*6 });
			else
				$titles.each(function(index, el)
					{
						var $el = $(el);
						if ($el.closest('.article-box').hasClass('fullwidth'))
							$el.dotdotdot({ height: $el.parent().height() });
						else
							$el.dotdotdot({ height: 26*6 });
					});
				// $titles.dotdotdot();

			$titles.css('opacity', 1);
			$details.each(function(index, el)
			{
				var $el = $(el);
				var fontSize = parseFloat($el.css('font-size') || 16);
				var titleHeight = $el.prev().height();
				var wrapperHeight = $el.parent().innerHeight();
				var parentTop = ($el.parent().offset() || {top:0}).top;
				var parentBottom = parentTop + $el.parent().innerHeight() - parseFloat( $el.parent().css('padding-top')||0 ) - parseFloat( $el.parent().css('padding-bottom')||0 );
				// var top = ($el.offset() || {top:0}).top;
				var titleBottom = ($el.prev().offset() || {top:0}).top + $el.prev().height();
				titleBottom += parseFloat($el.css('margin-top') || 0);
				// var remaining = wrapperHeight - titleHeight;
				var remaining = parentBottom - titleBottom;
				if (remaining >= fontSize)
				{
					var lineHeight = $el.css('line-height') || 0;
					if (lineHeight==='normal')
					{
						// lineHeight = ($el.css('font-size') || 16);
						lineHeight = fontSize * 1.15;
					}
					else
						lineHeight = parseFloat(lineHeight);

					var lineCount = remaining / lineHeight;
					lineCount = Math.ceil( lineCount );
					$el.dotdotdot({ height: lineCount*lineHeight });
				}
				else
				{
					$el.css('display', 'none');
				}
				$el.css('opacity', 1);
			});
		}

		// $titles.truncate({ lines: 6 });
		// $titles.each(function(index, el)
		// {
		// 	var $el = $(el);
		// 	var lineHeight = $el.css('line-height') || 0;
		// 	if (lineHeight==='normal')
		// 	{
		// 		lineHeight = ($el.css('font-size') || 16);
		// 		lineHeight = parseFloat(lineHeight) * 1.2;
		// 	}
		// 	else
		// 		lineHeight = parseFloat(lineHeight);

		// 	var height = $el.height();
		// 	var lines = height / lineHeight;
		// 	lines = Math.ceil(lines);
		// 	console.log('title['+$el.text()+'] has '+lines+' lines');
		// });
	}
}


function _handleCarouselChange(event, slick, currentSlide, nextSlide)
{
	var $track = $(event.target).find('.slick-track');

	$track.find('.slick-before').removeClass('slick-before');
	$track.find('.slick-after').removeClass('slick-after');

	var isBefore = true;
	var $lastSlide = null;
	$track.find('.slide-before-last').removeClass('slide-before-last');
	$track.find('.slick-slide').each(function(index, el)
	{
		var $el = $(el);
		if ($el.hasClass('slick-active'))
		{
			if ($lastSlide && $lastSlide.hasClass('slick-before'))
			{
				$lastSlide.parent().find('.slide-before-last').removeClass('slide-before-last');
				$lastSlide.addClass('slide-before-last');
			}
			isBefore = false;
		}
		else
			$el.addClass(isBefore ? 'slick-before' : 'slick-after');

		$lastSlide = $el;
	});
}



function setupTabbedCarouselLists()
{
	var changeEvent = 'beforeChange';//'afterChange';


	$('.tabbed-carousel-list-block > .selection-wrapper > select').on('change', function(e)
	{
		var $this = $(this);

		var val = $this.val();
		console.log('selection changed to val: '+val);

		var $title = null;

		// $('.tabbed-carousel-list-block > .selection-wrapper > .tabs > .tab > .tab-title')
		$this.closest('.selection-wrapper').find('.tabs > .tab > .underlined-title')
			.each(function(index, el)
		{
			var title = $(el).text();

			if (title == val)
			{
				$title = $(el);
				return false;
			}
		});

		if (!$title)
		{
			console.log('ERROR: no tab found with name '+val);
			return;
		}

		var $list = $title.next().children().clone();
		var $carousel = $title.closest('.tabbed-carousel-list-block').find('.carousel-package-list').first();
		if ($carousel.length > 0 && $carousel.hasClass('slick-initialized') && $.fn.slick)
		{
			$carousel.off(changeEvent);
			// free the old carousel
			$carousel.slick('unslick');
			$carousel.removeClass('slick-initialized');
		}
		$carousel
			// .empty().append($list)
			.html($list)
			;

		if ($.fn.slick)
		{
			$carousel.slick({
				slidesToShow: (isMobile ? 1 : 3),
				slidesToScroll: 1,
				// variableWidth: true,
				infinite: false,
				// centerMode: true,
				arrows: true,
				dots: true,
				// swipe: !isNonDesktop
			});

			if ($carousel.hasClass('slick-dotted')==false)
			{
				// $carousel.find('.slick-track').css('width', '');
				$carousel.find('.slick-track').attr('style', '');
			}

			// $carousel.on(changeEvent, _handleCarouselChange);
			$carousel.on(changeEvent, function(event, slick, currentSlide, nextSlide) { setTimeout(function(){_handleCarouselChange(event, slick, currentSlide, nextSlide); }); });

			setupPackageEvents();
		}

		$title.closest('.tabs').find('.tab.active').removeClass('active');
		$title.closest('.tab').addClass('active');
	});

	$('.tabbed-carousel-list-block > .selection-wrapper > .tabs > .tab > .underlined-title').on('click', function(e)
	{
		e.preventDefault();
		var $this = $(this);
		var title = $this.text();

		// trigger a select change event
		var $select = $this.closest('.selection-wrapper').children('select').first()
		$select.val(title);
		$select.trigger('change');


		// var $list = $this.next().children().clone();

		// var $carousel = $this.closest('.tabbed-carousel-list-block').find('.carousel-package-list').first();
		// $carousel
		// 	.empty()
		// 	// ;

		// // $carousel
		// 	.append($list)
		// 	// .html($list)
		// 	;

		// $this.closest('.tabs').find('.tab.active').removeClass('active');

		// $this.closest('.tab').addClass('active');
	});

	var resizeTimer = null;
	function handleResize(e)
	{
		console.log('setupTabbedCarouselLists: setupTabbedCarouselLists()');
		if (resizeTimer)
		{
			clearTimeout(resizeTimer);
			resizeTimer = null;
		}

		$('.carousel-package-list').each(function(index, el)
		{
			var $el = $(el);

			
			var $list = $el.find('.slick-list').first();
			var listWidth = $list.outerWidth(true);
			var $item = $el.find('.slick-track > .slick-slide').first();
			var itemWidth = $item.outerWidth(true);

			var count = Math.floor(listWidth / itemWidth);
			var slidesToShow = $el.slick('slickGetOption', 'slidesToShow') || 1;
			if (count != slidesToShow)
			{
				console.log('changed slidesToShow to '+count);
				$el.slick('slickSetOption', 'slidesToShow', count);
				$el[0].slick.refresh();
			}

		});

	}

	if ($.fn.slick)
		$(window).on('resize', function()
		{
			if (resizeTimer)
			{
				clearTimeout(resizeTimer);
				resizeTimer = null;
			}
			resizeTimer = setTimeout(handleResize, 100);
		});


	$('.tabbed-carousel-list-block > .selection-wrapper > select').val('Data').trigger('change');
	$('.tabbed-carousel-list-block').each(function(index, el)
	{
		_handleCarouselChange({target: el});
	});
	handleResize();
}

function handlePackageTitleClick(e)
{
	var $this = $(this);
	var $package = $this.closest('.package-item');

	var $sidebarInfo = $package.find('.sidebar-info').first();
	if ( $sidebarInfo.length > 0 )
	{
		openOfferSidebar( $sidebarInfo.children() );
	}

}

function setupPackageEvents()
{
	$('.package-item > .wrapper > .top > .title')
		.off('click', handlePackageTitleClick)
		.on('click', handlePackageTitleClick);
}


function setupPackageCarousels()
{
	var $packageLists = $('.package-list').not('.no-auto-carousel .package-list');

	var resizeTimer = null;
	function handleResize(e)
	{
		if (resizeTimer)
		{
			clearTimeout(resizeTimer);
			resizeTimer = null;
		}

		$packageLists.each(function(index, el)
		{
			var $el = $(el);

			
			var $list = $el.find('.slick-list').first();
			var listWidth = $list.outerWidth(true);
			var $item = $el.find('.slick-track > .slick-slide').first();
			var itemWidth = $item.outerWidth(true);

			var count = Math.floor(listWidth / itemWidth);
			var slidesToShow = $el.slick('slickGetOption', 'slidesToShow') || 1;
			if (count != slidesToShow)
			{
				console.log('changed slidesToShow to '+count);
				$el.slick('slickSetOption', 'slidesToShow', count);
				$el[0].slick.refresh();
			}

		});
	}

	var changeEvent = 'beforeChange';//'afterChange';
	$packageLists.each(function(index, el)
	{
		var $el = $(el);

		if ($.fn.slick)
		{
			$el.slick({
				slidesToShow: (isMobile ? 1 : 3),
				slidesToScroll: 1,
				// variableWidth: true,
				infinite: false,
				arrows: true,
				dots: true,
				// swipe: !isNonDesktop
			});

			if ($el.hasClass('slick-dotted')==false)
			{
				// $el.find('.slick-track').css('width', '');
				$el.find('.slick-track').attr('style', '');
			}

			$el.on(changeEvent, function(event, slick, currentSlide, nextSlide) { setTimeout(function(){_handleCarouselChange(event, slick, currentSlide, nextSlide); }); });
		}
	});

	setupPackageEvents();
}


function setupArticleBoxCarousels()
{
	var $carousel = $('.article-box-carousel');
	var changeEvent = 'beforeChange';//'afterChange';

	$carousel.each(function(index, el)
	{
		var $el = $(el);

		if ($.fn.slick)
		{
			$el.slick({
				slidesToShow: (isMobile ? 1 : 2),
				slidesToScroll: 1,
				// variableWidth: true,
				infinite: false,
				arrows: true,
				dots: true,
				// swipe: !isNonDesktop
			});

			if ($el.hasClass('slick-dotted')==false)
			{
				// $el.find('.slick-track').css('width', '');
				$el.find('.slick-track').attr('style', '');
			}

			// $el.on(changeEvent, function(event, slick, currentSlide, nextSlide) { setTimeout(function(){_handleCarouselChange(event, slick, currentSlide, nextSlide); }); });
		}
	});
}

function setupTabbedControls()
{
	var active = 'active';
	var $ctrls = $('.tabbed-control');

	function _activateTab($tabButton)
	{
		if ( $tabButton.hasClass(active) )
		{
			return;
		}

		var thisIndex = $tabButton.index();
		var $ctrl = $tabButton.closest('.tabbed-control');
		var $contentWrapper = $ctrl.find('.tab-contents:first');//.first();
		var $contentList = $contentWrapper.find('.tab-content:first').parent().children('.tab-content');

		$tabButton.siblings('.'+active).removeClass(active);
		$tabButton.addClass(active);
		$contentList.removeClass(active);
		var $content = $contentList.eq(thisIndex);

		if ( $content.hasClass('slick-initialized') || $content.find('.slick-initialized:first').length > 0 )
		{
			if ($.fn.slick)
			{
				// var $carousel = $content.find('.slick-initialized:first');
				// $carousel.slick('unslick');

				// // var $track = $carousel.find('.slick-track').first();
				// // // $track.attr('style', '');
				// // if ( $content[0].slick )
				// // {
				// // 	$content[0].slick.refresh();
				// // 	$content.slick('slickGoTo', 0);
				// // 	// _handleCarouselChange({target: $content[0]});
				// // 	// $content.slick('slickGoTo', 1);
				// // }
				
				
				$content.addClass(active);
				// setupGenericCarousel($carousel);
				$content.find('.slick-initialized').each(function(index, el)
					{
						el.slick.refresh();
					});
				// $content[0].slick.refresh();
			}
		}
		$content.addClass(active);

		var triggerName = $ctrl.attr('data-trigger') || '';

		if (triggerName.trim().length > 0)
		{
			console.log('triggering '+triggerName);
			$(window).trigger(triggerName, $ctrl);
		}
	}

	function _handleTabChange(e)
	{
		var $this = $(this);

		_activateTab($this);
	}

	function _triggerSelection(e)
	{
		var $this = $(this);

		if ( $this.hasClass(active) )
		{
			return;
		}

		var thisIndex = $this.index();
		var $buttons = $this.closest('.tab-buttons');
		var $select = $buttons.siblings('select.tab-options').first();
		var val = $select.children('option').eq(thisIndex).attr('value') || '';

		$select.val(val);
		$select.trigger('change');
	}

	function _handleSelectChange(e)
	{
		var $this = $(this);

		var val = $this.val();
		console.log('selection changed to val: '+val);

		var indexSelected = $this.find('option:selected').index();
		var $ctrl = $this.closest('.tabbed-control');
		var $tabs = $ctrl.find('.tab-buttons:first');
		var $tabButton = $tabs.find('.tab-button:first').first().parent().children('.tab-button').eq(indexSelected);

		_activateTab($tabButton);
	}

	function _registerSecondaryTabButtonActions($parent)
	{
		$parent.find('[data-tab-button-link]')
			.off('click')
			.on('click', function(e)
			{
				var $this = $(this);
				var classVal = $this.attr('data-tab-button-link') || '';

				if ( classVal.length > 0 )
				{
					var $closest = $this.closest('.tabbed-control');
					var $button = $closest.find(classVal).first();

					if ( $button.length > 0 )
					{
						e.preventDefault();
						_activateTab($button);
					}
				}
			});
	}


	
	$ctrls.each(function(index, el)
	{
		var $el = $(el);

		var $buttons = $el.find('.tab-buttons:first');
		var $options = $buttons.siblings('select.tab-options').first();

		if ($options.length > 0)
		{
			$options
				.off('change', _handleSelectChange)
				.on('change', _handleSelectChange)
				;

			$buttons/*.first()*/.find('.tab-button')
				.off('click')
				.on('click', _triggerSelection)
				;
		}
		else
		{
			$buttons/*.first()*/.find('.tab-button')
				.off('click')
				.on('click', _handleTabChange)
				;
		}

		_registerSecondaryTabButtonActions($el);

		$el.addClass('tabbed-control-initialized');
	});

}

function setupGenericCarousel($object)
{
	$object = $object || $('.carousel');

	var winWidth = $(window).width();
	var mobileBreakpoint = 600;

	$object.each(function(index, el)
	{
		var $el = $(el);

		if ( $el.hasClass('slick-initialized') )
			return;

		if ( $el.hasClass('no-auto-init') )
			return;

		var slidesToShow = Number($el.attr('data-slides-to-show') || 1);
		var slidesToScroll = Number($el.attr('data-slides-to-scroll') || 1);
		var infinite = Number($el.attr('data-infinite') || 0) == 1;
		var arrows = Number($el.attr('data-arrows') || 1) == 1;
		var dots = Number($el.attr('data-dots') || 1) == 1;
		var variableWidth = Number($el.attr('data-variable-width') || 0) == 1;
		var fitToSlides = Number($el.attr('data-fit-to-slides') || 1) == 1;
		var alignCenter = Number($el.attr('data-align-center') || 1) == 1;
		var swipe = Number($el.attr('data-swipe') || 1) == 1;
		var asNavFor = $el.attr('data-as-nav-for') || null;
		var mobile = ($el.attr('data-mobile') || 1) == 1;

		if ((isMobile || winWidth <= mobileBreakpoint) && mobile==false)
			return;

		var options = {
			slidesToShow: (isMobile ? 1 : slidesToShow),
			slidesToScroll: slidesToScroll,
			variableWidth: variableWidth,
			infinite: infinite,
			arrows: arrows,
			dots: dots,
			fitToSlides: fitToSlides,
			alignCenter: alignCenter,
			// asNavFor: asNavFor,
			swipe: swipe
			// swipe: !isNonDesktop
		};

		if (asNavFor)
			options[asNavFor] = asNavFor;

		$el.slick(options);
	});
}


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


function checkSidebarRoute(url)
{
	url = url || '';

	if ( url.indexOf('/sidebar/') > -1 )
		return url.slice( url.indexOf('/sidebar/') + '/sidebar/'.length );

	if ( url.indexOf('#opensidebar') > -1 )
		return url.slice( url.indexOf('#opensidebar') );
		// return url.slice( url.indexOf('#opensidebar') + '#opensidebar?'.length );

	return false;
}

function setupSidebarRouter()
{

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

		// var hash = window.location.hash || '';
		// $('.panel.'+activeClass).removeClass(activeClass);

		// // $('#base-panel').addClass(activeClass);
		// // if ( hash.length == 0 )
		// // {
		// // 	$('#base-panel').addClass('active');
		// // }

		// var parts = hash.split('#');
		// var panelsOpen = 0;
		// for (var i = 0; i < parts.length; i++)
		// {
		// 	if ( parts[i].length > 2 )
		// 	{
		// 		var $panel = $('#'+parts[i]);
		// 		console.log('#'+parts[i]+' set to active');
		// 		$panel.addClass(activeClass);
		// 		panelsOpen++;	
		// 	}
		// }

		// if (panelsOpen > 0)
		// {
		// 	$('html').addClass('mobile-panel-open');
		// }
		// else
		// {
		// 	$('html').removeClass('mobile-panel-open');
		// }

		// // var panelSel = parts[parts.length - 1];
		// // var $panel = $(panelSel);

	});

	var element_id = checkSidebarRoute(window.location.href);
	if (element_id)
	{
		if ( element_id.indexOf('#opensidebar?') > -1 )
		{
			element_id = element_id.slice( '#opensidebar?'.length );
		}
		openSidebar( $('#'+element_id) );
	}

}

function setupActionButtonTriggers()
{
	// $('.action-button').on('click', function(e)
	// {
	// 	var $this = $(this);
	// 	var href = $this.attr('href') || null;

	// 	if ( href )
	// 	{

	// 	}
	// });
}


function setupAccordion()
{
	$('.accordion .option').on('click', function(e)
	{
		var $this = $(this);

		if ( $this.hasClass('active') )
			return;

		var $parent = $this.closest('.accordion');

		$parent.children('.option').removeClass('active');
		$this.addClass('active');
	});
}


function setupHashNavigation()
{
	var navOffset = $('header .nav-menu').height();

	if (window.location.hash.length > 0)
	{
		// var hash = href.slice(0, href.indexOf('#'));
		var el = document.querySelector(window.location.hash);
		if (el)
		{
			scrollToElement(el, navOffset);
		}
	}


	$('a').on('click', function(e)
	{
		var $this = $(this);
		var href = $this.attr('href') || '';
		// if (href.indexOf('#') > -1)
		if (href.length > 0)
		{
			if (href.indexOf('#opensidebar') > -1 || href.indexOf('/sidebar/') > -1)
			{
				var title = $this.attr('data-sidebar-title') || null;
				if ($this[0].nodeName=='A')
					e.preventDefault();
				// openSidebarIFrame(href)
				
				History.pushState(null, title, href);
				openSidebar();
				$(window).trigger('load-side-url', href);

				return;
			}
			
			var path = href.slice(0, href.indexOf('#'));
			if (path.length > 0 && window.location.href.indexOf(path) > -1)
			{
				// if (path.indexOf('#opensidebar') > -1 || path.indexOf('/sidebar/') > -1)
				// {
				// 	var title = $this.attr('data-sidebar-title') || null;

				// 	e.preventDefault();
				// 	// openSidebarIFrame(href)
					
				// 	History.pushState(null, title, href);
				// 	openSidebar();
				// 	$(window).trigger('load-side-url', href);


				// 	return;
				// }

				var el = document.querySelector(href);
				if (el)
				{
					e.preventDefault();
					scrollToElement(el, -navOffset);
				}
			}
		}

	});

	$('[data-open-sidebar]').on('click', function(e)
	{
		var $this = $(this);

		var href = $this.attr('data-open-sidebar') || '';

		if (href.length > 0)
		{
			if (href.indexOf('#opensidebar') > -1 || href.indexOf('/sidebar/') > -1)
			{
				var title = $this.attr('data-sidebar-title') || null;
				if ($this[0].nodeName=='A')
					e.preventDefault();
				// openSidebarIFrame(href)
				
				History.pushState(null, title, href);
				openSidebar();
				$(window).trigger('load-side-url', href);

				return;
			}
		}
	});

	// $(window).on('hashchange', function(e) 
	// {
	// 	if (window.location.hash.length > 0)
	// 	{
	// 		var el = document.querySelector(window.location.hash);
	// 		if (el)
	// 		{
	// 			scrollToElement(el, navOffset);
	// 		}
	// 	}
	// });
}


function sendMsgToParent(msg)
{
	window.parent && window.parent.postMessage({from:'sidebar', sidebar: msg}, document.location.origin);
}

function registerIFrameCommunication()
{
	if (window.frameElement)
	{
		// this is the IFrame
	}
	else
	{
		// this is the host window
		window.addEventListener('message', function(event)
		{
			var origin = event.origin || event.originalEvent.origin;
			if (origin !== document.location.origin)
			{
				console.log('unknown message origin '+origin);
				return;
			} 
			var data = event.data || event.originalEvent.data;
			if (data.from && data.from=='sidebar')
			{
				var msg = data.sidebar || '';
				msg = 'sidebar-'+msg;

				$(window).trigger(msg);
			}
		});
	}
}


$(document).ready(function()
{
	setupLoginUI();
	setupInputs();
	setupNavigationMenu();
	setupHeaderCarousel();

	// setupTabbedCarouselLists();

	// setTimeout(function(){ 
		setupArticleBoxes(); 
	// }, 10);
	// setupPackageCarousels();
	setupArticleBoxCarousels();

	setupAccordion();

	setupTabbedControls();
	setupGenericCarousel();
	setupSidebar();
	setupHashNavigation();

	if (window.frameElement)
	{
		// this is in an IFrame
		sendMsgToParent('document.ready');
	}

	// DUMMY handler used during dev. you must remove it on production
	$(window).on('load-side-url', function(e, href)
	{
		// one should load the sidebar at this point
		// put it inside the aside#sidebar > .sidebar-contents
		// and call $(window).trigger('sidebar-loaded'); when finished
		var id = checkSidebarRoute(href);
		if ( id.indexOf('#opensidebar?') > -1 )
			id = id.slice( '#opensidebar?'.length );

		var $el = $('#'+id);
		var $container = $('aside#sidebar > .sidebar-contents');
		$container.empty();
		$container.append($el.children().clone());

		setTimeout(function()
		{
			$(window).trigger('sidebar-loaded');
		}, 4*1000);
	});

});

$(window).on('load', function()
{
	setupUserInfoDashboard();
});
