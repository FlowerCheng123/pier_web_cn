angular.module( 'pier.account' )
.controller( 'BasicInfoController', function( $scope, $log, $http, ApiUrl, PierUtil, HttpService, ProvinceData, CityData, CountyData, $timeout ){
	$scope.profile = {};
	$scope.profileEdit = {};
	
	$scope.editStatus = false;
	$scope.phoneLength = 11;
	$scope.phoneErrorMsg = '您的手机号必须是'+$scope.phoneLength+'的中国手机号';

	$scope.address = {};
	$scope.addressEdit = {};
	$scope.provinceItems = ProvinceData.items;
	$scope.provinceChange = function(){
		$scope.cityItems = CityData.items[$scope.addressEdit.province['province_id']];
		$scope.addressEdit.city = $scope.cityItems[0];
		$scope.countyItems = CountyData.items[$scope.addressEdit.city['city_id']];
		$scope.addressEdit.county = $scope.countyItems[0];
	}
	$scope.cityChange = function(){
		$scope.countyItems = CountyData.items[$scope.addressEdit.city['city_id']];
		$scope.addressEdit.county = $scope.countyItems[0];
	}

	$scope.getProfile = function(){
		var url = ApiUrl.getProfile;
		var message = {};
		$scope.loadingData = true;
		var pGetProfile = HttpService.templateAccessAPI( url, message );
		pGetProfile.then( function( result ){
			$log.debug( 'merchant get profile success', result );
			$scope.profile = result;
			$scope.address.address_detail = $scope.profile.address_detail;
    		for( var obj in  $scope.provinceItems){
    			if( $scope.provinceItems[obj].province_id == result.address_province_id ){
    				$scope.address.province = $scope.provinceItems[obj];
    				$scope.cityItems = CityData.items[$scope.address.province['province_id']];
    				for( var obj1 in $scope.cityItems ){
    					if( $scope.cityItems[obj1].city_id == result.address_city_id ){
    						$scope.address.city = $scope.cityItems[obj1];
    						$scope.countyItems = CountyData.items[$scope.address.city['city_id']];
    						for( var obj2 in $scope.countyItems ){
    							if( $scope.countyItems[obj2].county_district_id == result.address_district_id ){
    								$scope.address.county = $scope.countyItems[obj2];
    							}
    						}
    					}
    				}
    			}
    		}
    		$scope.allAddress = $scope.address.province.province_name +" "+$scope.address.city.city_name +" "+ $scope.address.county.county_district_name +" "+ $scope.address.address_detail;
		}, function( reason ){
			$log.debug( 'merchant get profile failed ', reason );
		}).then( function(){
			$scope.loadingData = false;
		} )
	};

	$scope.changeEditStatus = function(){
		angular.copy( $scope.profile, $scope.profileEdit );
		if( !$scope.editStatus ){
			angular.forEach( $scope.address, function(value, key) {
				$log.debug( key, value );
			    $scope.addressEdit[key] = angular.copy( $scope.address[key]);
			});
			for( var obj in  $scope.provinceItems){
    			if( $scope.provinceItems[obj].province_id == $scope.addressEdit.province['province_id'] ){
    				$scope.addressEdit.province = $scope.provinceItems[obj];
    				$scope.cityItems = CityData.items[$scope.addressEdit.province['province_id']];
    				for( var obj1 in $scope.cityItems ){
    					if( $scope.cityItems[obj1].city_id == $scope.addressEdit.city['city_id'] ){
    						$scope.addressEdit.city = $scope.cityItems[obj1];
    						$scope.countyItems = CountyData.items[$scope.addressEdit.city['city_id']];
    						for( var obj2 in $scope.countyItems ){
    							if( $scope.countyItems[obj2].county_district_id == $scope.addressEdit.county['county_district_id'] ){
    								$scope.addressEdit.county = $scope.countyItems[obj2];
    							}
    						}
    					}
    				}
    			}
    		}
		}
		$scope.editStatus = !$scope.editStatus;
		$scope.timeStemp = 60;
		$scope.hasSendCode = false;
		$scope.sendCodeFlag = false;
		$scope.timeHandler = $scope.checkCode.getCode;
		$scope.smsCode = '';
	}
	$scope.getProfile();

	    //activation code
	$scope.checkCode = {
		right: "验证码正确",
		resend: "重新发送",
		getCode: "获取验证码"

	}
	//time cloak
	$scope.timeHandler = $scope.checkCode.getCode;
	$scope.smsCode = ''
	$scope.hasSendCode = false;
	$scope.timeStemp = 60;
	$scope.sendCodeFlag = false;
	$scope.serviceRule = false;
	$scope.phoneLength = 11;

    $scope.getValidCode = function(){
    	if( $scope.profileEdit.agent_phone == '' || $scope.phoneLength != $scope.profileEdit.agent_phone.length ){
    		$scope.phoneError = true;
    		return;
    	}
    	$scope.sendCodeFlag = true;
    	var url = ApiUrl.smsUpdatePhone,
    	message = {
    		agent_phone: $scope.profileEdit.agent_phone,
    	};
    	var pGetCode = HttpService.templateAccessAPI( url, message );
    	pGetCode.then( function( result ){
    		$log.debug('get valid code success', result );
    		$scope.hasSendCode = true;
    		timer();
    		$scope.smsCode = '';
    	}, function( reason ){
            $log.debug('get valid code failed', reason );
    	}).then(function(){
    		$scope.sendCodeFlag = false;
    	})
    };
    var timer = function(){
		if ( !$scope.hasSendCode || $scope.timeHandler == $scope.checkCode.right ) {
			return;
		}
		$scope.timeHandler = $scope.timeStemp;
		$scope.timeStemp -= 1;
		if( $scope.timeStemp == 0 ){
			$scope.timeStemp = 60;
			$scope.timeHandler = $scope.checkCode.resend;
			$scope.hasSendCode = false;
			$scope.sendCodeFlag = false;
			return;
		}
        return $timeout( timer, 1000);
	};

	$scope.saveInfo = function(){
		var url = ApiUrl.updateProfile;
		var message = {
			business_name: $scope.profileEdit.business_name,
			address_province_id: $scope.addressEdit.province.province_id,
			address_city_id: $scope.addressEdit.city.city_id,
			address_district_id: $scope.addressEdit.county.county_district_id,
			address_detail: $scope.addressEdit.address_detail,
			postal_code: $scope.profileEdit.postal_code,
			zip_code: $scope.profileEdit.zip_code,
			agent_name: $scope.profileEdit.agent_name,
			agent_phone: $scope.profileEdit.agent_phone,
			office_phone: $scope.profileEdit.office_phone,
			sms_code: $scope.smsCode,
			web_site: $scope.profileEdit.web_site
		};
		var pSaveInfo = HttpService.templateAccessAPI( url, message );
		pSaveInfo.then( function( result ){
			$log.debug( 'merchant save info success ', result );
			PierUtil.popup({ title: '更新信息', content: '更新信息成功' }, function(){
				$scope.changeEditStatus();
				$scope.getProfile();
			});
		}, function( reason ){
			$log.debug( 'merchant save info failed ' );
		})
	}
})
.controller( 'KeyManagerController', function( $scope, $log, $http, ApiUrl, PierUtil, HttpService ){
	
} )
