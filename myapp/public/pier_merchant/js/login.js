angular.module( 'LoginApp',[] )
.config( function( $logProvider ){
	$logProvider.debugEnabled( false );
} )
.controller( 'LoginController', function( $scope, $log, $http ){
	var CONSTANT = {
		emailError: '邮箱格式不正确'
	}
	var isEmpty = function( input ){
		return input == '' || input == undefined || input == null;
	}
	$scope.validateEmail = function(){
		$scope.emailNotRight = false;
    	if( $scope.email == '' || $scope.email == undefined ) return;
	   	var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
	   	if( !reg.test($scope.email) ){
            $scope.emailNotRight = true;
            $scope.emailErrorMsg = CONSTANT.emailError;
	   	}
	}
	$scope.login = function(){
		if( isEmpty($scope.email) || isEmpty($scope.password) || isEmpty($scope.authCode) ) return;
		var url = '/merchants/api/login';
		var message = {
			email: $scope.email,
			password: $scope.password,
			clientid: $scope.clientId,
			kaptcha: $scope.authCode
		};
		$scope.signInFlag = true;
		$http.post( url, message )
		.success(function(data, status, headers, config) {
			$log.debug( 'merchant sign in success', data );
			if( data.code == '200' ){
				switch( data.result.status_bit ){
					case '4': window.location.href="/merchants/emailVerify?email="+$scope.email;break;
					case '5': window.location.href="/merchants/dashboard";break;
					case '7': window.location.href="/merchants/dashboard";break;
					default: window.location.href="/merchants/dashboard"; break;
				}
			}else{
				$scope.signInErrorMsg = data.message;
				$scope.signInError = true;
			}
			$scope.signInFlag = false;
		})
		.error(function(data, status, headers, config) {
			$scope.signInFlag = false;
		});
	}
	$scope.guid = function() {
		function s4() {
			return Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 ).substring( 1 );
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}
	$scope.getImage = function(){
		$scope.clientId = $scope.guid();
		var url = '/merchants/getHostName';
		var message = {};
		$http.post( url, message )
		.success(function(data, status, headers, config) {
			$log.debug( 'merchant getHostname success', data );
			$scope.imageUrl = data.result.hostname+'/api-validatecode/getImage?op=clean&clientid='+$scope.clientId;
		})
		.error(function(data, status, headers, config) {
			$log.debug( 'merchant getHostname failed', data );
		});
		
	}
	$scope.getImage();
} )
.controller( 'ForgetController', function( $http, $scope, $log ){
	$scope.forgetFlag = false;
	$scope.forgetError = false;
	$scope.next = function(){
		$scope.validateEmail();
		if( $scope.email == '' || $scope.email == undefined || $scope.forgetError ) return;
		var url = '/merchants/api/forgetPassword';
		var message = {
			email: $scope.email
		}
		$scope.forgetFlag = true;
		$http.post( url, message )
		.success(function(data, status, headers, config) {
			$log.debug( 'merchant forget password success', data );
			if( data.code == '200' ){
				window.location.href="/merchants/emailReset?email="+$scope.email;
			}else{
				$scope.forgetErrorMsg = data.message;
				$scope.forgetError = true;
			}
			$scope.forgetFlag = false;
		})
		.error(function(data, status, headers, config) {
			$scope.forgetFlag = false;
		});
	}
	$scope.validateEmail = function(){
		$scope.forgetError = false;
    	if( $scope.email == '' || $scope.email == undefined ) return;
	   	var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
	   	if( !reg.test($scope.email) ){
            $scope.forgetError = true;
            $scope.forgetErrorMsg = "邮箱格式不正确";
	   	}
	}
})