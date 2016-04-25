angular.module( 'VerificationApp', [] )
.controller( 'VerificationController', function( $scope, $http, $log, $timeout ){
	$scope.verifyError = false;
	$scope.timer = 5;
	$scope.verify = function(){
		var _token = $('#token').val();
		var url = '/merchants/api/emailVerification';
		var message = {
			verification_token: _token
		};
		$scope.loadingData = true;
		$http.post( url, message )
		.success(function(data, status, headers, config) {
			$log.debug( 'merchant verification success', data );
			if( data.code == '200' ){
				setTimer();
			}else{
				$scope.verifyErrorMsg = data.message;
				$scope.verifyError = true;
			}
			$scope.loadingData = false;
		})
		.error(function(data, status, headers, config) {
			$scope.loadingData = false;
		});
	};
	var setTimer = function(){
		if( $scope.timer == 0 ){
			window.location.href="/merchants/login";
			return;
		}
		$scope.timer -= 1;
		return $timeout( setTimer, 1000);
	}
	$scope.verify();
})
.controller( 'ResetController', function( $scope, $http, $log ){

	$scope.passwordTip = false;
	$scope.passwordNotRight = false;
	$scope.resetFlag = false;
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
		}
		if( $scope.passwordConfirm != '' || $scope.passwordConfirm != undefined ){
			$scope.validateMatch();
		}
	};

	$scope.resetPassword = function(){
		$scope.validateMatch();
		$scope.validPassword();
		if( $scope.password == '' || $scope.password == undefined || $scope.passwordConfirm == '' || $scope.passwordConfirm == undefined ) return;
		if( $scope.passwordNotRight || $scope.passwordNotMatch ) return;
		var _token = $('#token').val();
		var url = '/merchants/api/resetPassword',
		message = {
			password: $scope.password,
			token: _token
		};
		$scope.resetFlag = true;
		$http.post( url, message )
		.success(function(data, status, headers, config) {
			$log.debug( 'merchant reset password success', data );
			if( data.code == '200' ){
				window.location.href="/merchants/resetSuccess"

			}else{
				$scope.resetErrorMsg = data.message;
				$scope.resetError = true;
			}
			$scope.resetFlag = false;
		})
		.error(function(data, status, headers, config) {
			$scope.resetFlag = false;
		});
	}

})