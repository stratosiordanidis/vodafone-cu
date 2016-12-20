'use strict';

var $html = $('html');
var isNonDesktop = !$html.hasClass('desktop');
var isMobile = $html.hasClass('mobile');
var isIOS = $html.hasClass('ios');


var ua = navigator.userAgent || navigator.vendor || window.opera;
var isChrome = /Chrome/.test(ua) && /Google Inc/.test(ua);
var isSafari = /Safari/.test(ua) && /Apple Computer/.test(ua);
var isFirefox = /Firefox/.test(ua) && /Gecko/.test(ua);
var isEdge = /Edge\/\d./i.test(ua);
var isTrident = /Trident\/\d./i.test(ua);
var isFBWebview = (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);

if (isFBWebview)
	$html.addClass('fb-webview');
	

if (isFirefox)
	$html.addClass('firefox');

if (isTrident)
{
	$html.addClass('trident');
	var idx = navigator.userAgent.indexOf('Trident/')+'Trident/'.length;
	if (navigator.userAgent.indexOf('MSIE ') > -1)
		$html.addClass('oldie');

}

if (isEdge)
{
	$html.addClass('edge')
			.removeClass('trident');
	console.log('Edge browser detected.');
}


if (isSafari)
	$html.addClass('safari');

if (isChrome)
	$html.addClass('chrome');

var isWebkit = isChrome || isSafari;
var isIE = isTrident || isEdge;