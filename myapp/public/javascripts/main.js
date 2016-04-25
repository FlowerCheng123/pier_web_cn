"use strict";
/**requirejs configuration  20150630**/
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: "../bower_components",
    paths: {
        "jquery" : ["jquery/dist/jquery.min", "//cdn.bootcss.com/jquery/2.1.3/jquery.min"],
        "bootstrap": ["bootstrap/dist/js/bootstrap.min", "//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min"],
        "vCenter":["../javascripts/plugin/pier-plugin"]
    }
});
/** 
 * @author Flower
 * @date 2015-06-30
 * @description home page for '省钱，省时，从未如此简单' part
 */
require( ['bootstrap','vCenter'], function(){
	var currentPath = window.location.pathname;

    //For Home page
	if( currentPath == '/'){
		//for make credit-model-wrap's inner div verticle center
		$(window).resize(function(){
			$.vCenter( $('.credit-model-wrap'), $('.credit-model-wrap .container') );
			$.vCenter( $('.hom-speciality'), $('.hom-speciality .container') );
		})
		$(window).resize();
		$(function(){
			var $_items = $('.process span'),
			$_arrow = $('.content .up'),
			$_preItem = $($_items[0]),
			preIndex = 0;
			$_items.click(function(){
				var index = $(this).index()/3;
				$_preItem.removeClass('active');
				$(this).addClass('active');
				$_arrow.removeClass('part'+preIndex).addClass('part'+index);
				$('.content .wording #word'+preIndex).slideUp();
				$('.content .wording #word'+index).slideDown();
				$_preItem = $(this);
				preIndex = index;
			});
		});
	}
	if( currentPath == '/Corporation'){
		$(window).resize(function(){
			$.vCenter( $('.fees-wrap'), $('.fees-wrap .container') );
		})
		$(window).resize();
	}
	
	//for join us
	if( currentPath == '/joinus' ){
		$(".cont-wrap").click(function(){
			$(this).extension({});
		})
	}
} );