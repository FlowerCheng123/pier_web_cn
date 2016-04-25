angular.module( 'RegisterApp',[] )
.config( function( $logProvider ){
	$logProvider.debugEnabled( false );
} )
.controller( 'RegisterController', function( $scope, $log, $http ){
	$scope.serviceRule = false;
	$scope.signUpFlag = false;
	$scope.emailNotRight = false;
	$scope.passwordTip = false;
	$scope.passwordNotRight = false;
	$scope.signUpError = false;
	var CONSTANT = {
		emailError: '您的邮箱格式不正确！'
	}
	//confirm password on blur
	$scope.validateMatch = function(evt) {
		if( $scope.password == '' || $scope.password == undefined || $scope.passwordNotRight || $scope.passwordConfirm == '') return;
		$scope.passwordNotMatch = false;
		if( $scope.passwordConfirm == '' || $scope.passwordConfirm == undefined ) return;
		if( $scope.password == $scope.passwordConfirm ) return;
		$scope.passwordNotMatch = true;
	};
	$scope.validPassword = function(){
		if( $scope.password == '' || $scope.password == undefined ) return; 
		var reg = /^(?=.*\d)(?=\S*[^\d])[\S]{6,}$/;
		$scope.passwordNotRight = false;

		if( !reg.test($scope.password ) ){
			$scope.passwordNotRight = true;
			console.log( $scope.passwordNotRight )
		}
		if( $scope.passwordConfirm != '' || $scope.passwordConfirm != undefined ){
			$scope.validateMatch();
		}
	};
	$scope.validateEmail = function(){
		$scope.emailNotRight = false;
    	if( $scope.email == '' || $scope.email == undefined ) return;
	   	var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
	   	if( !reg.test($scope.email) ){
            $scope.emailNotRight = true;
            $scope.emailErrorMsg = CONSTANT.emailError;
	   	}
	}
	$scope.signUp = function(){
		if( $scope.passwordNotMatch || $scope.passwordNotRight || $scope.emailNotRight || !$scope.serviceRule ) return;
		if( notEmpty( $scope.email) && notEmpty( $scope.password ) && notEmpty( $scope.passwordConfirm ) ){
			var url = '/merchants/api/register';
			var message = {
				email: $scope.email,
				password: $scope.password
			}
			$scope.signUpFlag = true;
			$scope.signUpError = false;
			$http.post( url, message )
			.success(function(data, status, headers, config) {
				$log.debug( 'merchant sign up success', data );
				if( data.code == '200' ){
					window.location.href="/merchants/emailVerify?email="+$scope.email;
				}else{
					$scope.signUpErrorMsg = data.message;
					$scope.signUpError = true;
				}
				$scope.signUpFlag = false;
			})
			.error(function(data, status, headers, config) {
				$scope.loading = false;
			});
		}
	}
	var notEmpty = function( input ){
		return input != '' && input != undefined && input != null;
	}
} )
.controller( 'ResendController', function( $scope, $log, $http ){
	$scope.sendFlag = false;
	$scope.hasResendEmail = false;

	$scope.resend = function(){
		$scope.sendFlag = true;
		var url = '/merchants/authapi/resendVerification',
		message = {};
		$http.post( url, message )
		.success(function(data, status, headers, config) {
			$log.debug( 'merchant resend email success', data );
			$scope.sendFlag = false;
			$scope.hasResendEmail = true;
		})
		.error(function(data, status, headers, config) {
			$scope.sendFlag = false;
			$scope.hasResendEmail = true;
		});
	}
	$scope.resend();
} )