angular.module( 'GongjijinApp', ['ui.bootstrap'] )
.factory('UrlPath', function(){
	return {
		nodify_url: 'pierAuthentication://social.callback',
		zhengxinValid: '/mobile/zhengXinValid',
		gongjijinAddress: '/mobile/gongjijinAddress',
		gongjijinValid: '/mobile/gongjijinValid',
		zhengXinImage: '/mobile/zhengXinPrepare'
	}
})
.controller( 'GongController', function( $scope, $http, $log, $q, $uibModal, UrlPath ){
	$scope.notify_url = UrlPath.nodify_url;
	$scope.loading = false;
	$scope.getAddress = function(){
		var url = UrlPath.gongjijinAddress;
		$http.get( url ).
	    success(function(data, status, headers, config) {
		    $scope.cities = data.result.items;
		    $scope.area = $scope.cities[0];
		    $scope.validImage = $scope.area.authcode_url;
	    }).
	    error(function(data, status, headers, config) {
	    });
	}
	$scope.getAddress();
	$scope.shouquanxianyi = function(){
		$uibModal.open({
			size: 'lg',
			templateUrl: 'shouquanxianyi.html',
			controller: 'ShouquanController'
		})
	}
	$scope.shouquan = function(){
		$uibModal.open({
			size: 'lg',
			templateUrl: 'gjjrhsq.html',
			controller: 'ShouquanController'
		})
	}
	$scope.getImage = function(){
	    $scope.validImage = $scope.area.authcode_url+'?v='+Date.parse(new Date());
	}
	var nullOrUndefined = function( input ){
		if( input == '' || input == undefined ) return true;
		else false;
	}
	$scope.validGongjijin = function(){
		$scope.errorMsg = '';
		if( nullOrUndefined($scope.username) || nullOrUndefined($scope.password) ){
			$scope.errorMsg = '请完善信息';
			return;
		}
		var url = UrlPath.gongjijinValid;
		var message = {
			user_id: $('#userId').val(),
			session_token: $('#sessionToken').val(),
			userName: $scope.username,
			password: $scope.password,
			authcode: getRandomCode(),
			gongjj_id: $scope.area.id
		};
		$scope.loading = true;
		$http.post( url, message ).
		success(function(data, status, headers, config) {
			$scope.loading = false;
			if( data.code == '200' ){
				window.location.href = $scope.notify_url+'?result='+JSON.stringify(data.result);
				return;
			}else{
				$scope.errorMsg = data.message;
				return;
			}
		}).
		error(function(data, status, headers, config) {
			$scope.loading = false;
		});
	}
	var getRandomCode = function(){
		var tempStr = '';
		for( var i=0;i<4;i++){
			tempStr += Math.floor(Math.random()*10);
		}
		return tempStr;
	}
})
.controller( 'ShouquanController', function( $scope, $uibModalInstance ){
	$scope.close = function(){
		$uibModalInstance.close();
	}
} )
.controller( 'ZhengXinController', function( $scope, $http, $log, $q, $uibModal, UrlPath ){
	$scope.notify_url = UrlPath.nodify_url;
	var nullOrUndefined = function( input ){
		if( input == '' || input == undefined ) return true;
		else false;
	};
	$scope.loading = false;
	$scope.validZhengXin = function(){
		$scope.errorMsg = '';
		if( nullOrUndefined( $scope.username ) || nullOrUndefined($scope.password) || nullOrUndefined($scope.validCode) ){
			$scope.errorMsg = '请完善信息';
			return;
		}
		$scope.loading = true;
		var url = UrlPath.zhengxinValid;
		var message = {
			user_id: $('#userId').val(),
			session_token: $('#sessionToken').val(),
			username: $scope.username,
			password: $scope.password,
			identityCode: $scope.identityCode,
			imageCode: $scope.validCode,
			date: $scope.date,
		};
		$http.post( url, message ).
		success(function(data, status, headers, config) {
			$scope.loading = false;
			if( data.code == '200' ){
				window.location.href = $scope.notify_url+'?result='+JSON.stringify(data.result);
				return;
			}else{
				$scope.errorMsg = data.message;
				return;
			}
		}).
		error(function(data, status, headers, config) {
			$scope.loading = false;
		});
	};

	$scope.getImage = function(){
		var url = UrlPath.zhengXinImage;
		$http.get( url ).
	    success(function(data, status, headers, config) {
		    $scope.validImage = data.image_url;
		    $scope.date = data.date;
	    }).
	    error(function(data, status, headers, config) {
	    });
	}
	$scope.getImage();

	$scope.shouquanxianyi = function(){
		$uibModal.open({
			size: 'lg',
			templateUrl: 'zhengxinxieyi.html',
			controller: 'ShouquanController'
		})
	}
	$scope.shouquan = function(){
		$uibModal.open({
			size: 'lg',
			templateUrl: 'zxrhsq.html',
			controller: 'ShouquanController'
		})
	}
})
