define(['../bower_components/jquery/dist/jquery.min'],function(){
	$.extend({
		//inner div whin outter div for verticle center
		vCenter:function( out, inner ){
			$_out = out;
			$_inner = inner;
			$_out.css("position","relative");
			$_inner.css("position","absolute");
			$_inner.css( "left", ($_out.width() - $_inner.width())/2 + "px" );
			$_inner.css( "top", ($_out.height() - $_inner.height())/2 + "px" );
		}
	});
	$.fn.extension = function( options ){
		var options = options || {},
		$_part2 = $(this).children(':nth-child(2)'),
		$_sibling = $(this).siblings();
		var timeSec = options.delay || 500;
		var slide = function( obj,type ){
			var $_part1Temp = $(obj).children(':first-child'),
			$_part2Temp = $(obj).children(':nth-child(2)');
			$_part1Temp.children('img').attr( 'src', type === 'up'?'/images/down.png':'images/up.png');
			type === 'up'?$_part1Temp.removeClass('purple-thin'):$_part1Temp.addClass('purple-thin');
			type === 'up'?$_part2Temp.slideUp(timeSec):$_part2Temp.slideDown(timeSec);
		};
	    $_sibling.each( function(i){
	    	slide(this,'up');
	    })
	    $_part2.is(':hidden')?slide(this,'down'):slide(this, 'up');
	}
	return $;
}) 