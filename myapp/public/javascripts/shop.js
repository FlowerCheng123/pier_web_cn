angular.module( 'PierShop1', ['ui.bootstrap','ngAnimate'])
.controller( 'PierShopController', function(){

} )
.controller('CarouselCtrl', function ($scope) {
  $scope.myInterval = 3000;
  $scope.noWrapSlides = false;
  var slides = $scope.slides = [];
  var _text = [ '注重生活品质的您，光知道GNC和Costco怎么够？美国人都会用什么样的产品来犒劳忙碌的自己？品而的美国团队精心挑选了美国优质的本土品牌，把美国人眼中最高质量的产品隆重推荐给您。', 
                '注重生活品质的您，光知道GNC和Costco怎么够？美国人都会用什么样的产品来犒劳忙碌的自己？品而的美国团队精心挑选了美国优质的本土品牌，把美国人眼中最高质量的产品隆重推荐给您。', 
                '注重生活品质的您，光知道GNC和Costco怎么够？美国人都会用什么样的产品来犒劳忙碌的自己？品而的美国团队精心挑选了美国优质的本土品牌，把美国人眼中最高质量的产品隆重推荐给您。', 
                '注重生活品质的您，光知道GNC和Costco怎么够？美国人都会用什么样的产品来犒劳忙碌的自己？品而的美国团队精心挑选了美国优质的本土品牌，把美国人眼中最高质量的产品隆重推荐给您。'];
  var _banners = [];
  $scope.addSlide = function(i) {
    var newWidth = 600 + slides.length + 1;
    var _i = i+1;
    slides.push({
      image: 'images/ad'+ _i+'.jpg',
      banner: 'images/logo' + _i + '.jpg',
      text: _text[i]
    });
  };
  for (var i=0; i<4; i++) {
    $scope.addSlide(i);
  }
});