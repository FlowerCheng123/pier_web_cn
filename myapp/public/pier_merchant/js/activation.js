angular.module( 'pier.account' )
.controller( 'ActivationController', function( $scope, $log, $timeout, ProvinceData, HttpService, ApiUrl, $state, $http, PierUtil ){
	// $scope.activeStep = 1;
	$scope.contentUrls = [
		{ id: 1, url: '../pier_merchant/view/activation/activation-step1.html' }, 
		{ id: 2, url: '../pier_merchant/view/activation/activation-step2.html' }, 
		{ id: 3, url: '../pier_merchant/view/activation/activation-step3.html' }
	];
	$scope.currentPanel = $scope.contentUrls[0];
    $scope.contentUrl = $scope.currentPanel.url;
    $scope.nextStep = function(){
    	switch( $scope.currentPanel.id ){
    		case 1: break;
    		case 2: break;
    		case 3: break;
    	}
    	if( $scope.currentPanel.id == $scope.contentUrls.length ) return;
    	$scope.currentPanel = $scope.contentUrls[$scope.currentPanel.id];
    	$scope.contentUrl = $scope.currentPanel.url;
    };
    $scope.previousStep = function(){
    	switch( $scope.currentPanel.id ){
    		case 1: break;
    		case 2: break;
    		case 3: break;
    	}
    	if( $scope.currentPanel.id == 1 ) return;
    	$scope.currentPanel = $scope.contentUrls[$scope.currentPanel.id-2];
    	$scope.contentUrl = $scope.currentPanel.url;
    }

})
.controller( 'Activation1Controller', function( $scope, $log, ProvinceData, HttpService, ApiUrl, PierUtil, CityData, CountyData ){
	$scope.basicInfoFlag = false;
	$scope.loadingData = false;
	//address
	$scope.address = {};
	$scope.provinceItems = ProvinceData.items;
	$scope.address.province = $scope.provinceItems[0];

	$scope.cityItems = CityData.items[$scope.address.province['province_id']];
	$scope.address.city = $scope.cityItems[0];
	$scope.countyItems = CountyData.items[$scope.address.city['city_id']];
	$scope.address.county = $scope.countyItems[0];

	$scope.provinceChange = function(){
		$scope.cityItems = CityData.items[$scope.address.province['province_id']];
		$scope.address.city = $scope.cityItems[0];
		$scope.countyItems = CountyData.items[$scope.address.city['city_id']];
		$scope.address.county = $scope.countyItems[0];
	}
	$scope.cityChange = function(){
		$scope.countyItems = CountyData.items[$scope.address.city['city_id']];
		$scope.address.county = $scope.countyItems[0];
	}
    $scope.saveBasicInfo = function(){
    	if( !PierUtil.notEmpty([$scope.company,
					    	   $scope.address.addressDetail,
					    	   $scope.postal,
					    	   $scope.zipCode,
					    	   $scope.officePhone,
					    	   $scope.website]) ) return;
    	var url = ApiUrl.saveBasicInfo,
    	message = {
    		business_name: $scope.company,
    		address_province_id: $scope.address.province.province_id,
    		address_city_id: $scope.address.city.city_id,
    		address_district_id: $scope.address.county.county_district_id,
    		address_detail: $scope.address.addressDetail,
    		postal_code: $scope.postal,
    		zip_code: $scope.zipCode,
    		office_phone: $scope.officePhone,
    		web_site: $scope.website
    	};
    	$scope.basicInfoFlag = true;
    	var pSave = HttpService.templateAccessAPI( url, message );
    	pSave.then( function( result ){
    		$log.debug( 'merchant save basic info success', result );
    		$scope.nextStep();
    	}, function( reason ){
    		$log.debug( 'merchant save basic info failed', reason );
    	}).then(function(){
	    	$scope.basicInfoFlag = false;
    	})
    };

    $scope.getBasicInfo = function(){
    	var url = ApiUrl.merchantInfo;
    	var message = {};
    	$scope.loadingData = true;
    	var pGetInfo = HttpService.templateAccessAPI( url, message );
    	pGetInfo.then( function( result ){
    		$log.debug( 'get basic info success', result );
    		$scope.company = result.business_name;
    		$scope.website = result.web_site;
    		$scope.officePhone = result.office_phone;
    		$scope.zipCode = result.zip_code;
    		$scope.postal = result.postal_code;
    		$scope.address.addressDetail = result.address_detail;
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

    	}, function( reason ){
			$log.debug( 'get basic info failed', reason );
			PierUtil.popup( { title: '', content: reason.message } );
    	} ).then( function(){
    		$scope.loadingData = false;
    	} )
    }
    $scope.getBasicInfo();
})
.controller( 'Activation2Controller', function( $scope, $log, ProvinceData, HttpService, ApiUrl, PierUtil, UploaderPlugin ){
	UploaderPlugin.initUploaderPlugin();
    $scope.saveInfoFlag = false;
    $scope.loadingData = false;
    $scope.imageUrl = {
    	businessLicense: '../images/企业委托书.png',
    	institutionCode: '../images/组织机构代码.png',
    	taxId: '../images/营业执照.png',
    	businessEntityIdCard1: '../images/身份证正面.png',
    	businessEntityIdCard2: '../images/身份证背面.png'
    }
    $scope.businessLicenseImageUrl = '../images/企业委托书.png';
	$scope.saveInfomation2 = function(){
		if( !PierUtil.notEmpty( [$scope.businessLicense,
			                     $scope.institutionCode,
			                     $scope.taxId,
			                     $scope.businessEntity,
			                     $scope.businessEntityIdCard ]) ){
			$log.debug( { '$scope.businessLicense':$scope.businessLicense,'$scope.institutionCode':$scope.institutionCode,'$scope.taxId':$scope.taxId,'$scope.businessEntity':$scope.businessEntity,'$scope.businessEntityIdCard':'$scope.businessEntityIdCard'})
			return;
		} 
		var url = ApiUrl.saveLicenseInfo;
		var message = {
			business_license: $scope.businessLicense,
			organization_code: $scope.institutionCode,
			tax_id: $scope.taxId,
			legal_person_name: $scope.businessEntity,
			legal_person_id_number: $scope.businessEntityIdCard
		};
		$scope.saveInfoFlag = true;
		var pSaveInfo = HttpService.templateAccessAPI( url, message );
		pSaveInfo.then( function( result ){
			$log.debug( 'save information2 success', result );
			$scope.nextStep();
		}, function( reason ){
			$log.debug( 'save information2 failed', reason );
			$scope.errorMsg = reason.message;
		} ).then( function(){
			$scope.saveInfoFlag = false;
		} )
	}
	$scope.getBasicInfo = function(){
    	var url = ApiUrl.merchantInfo;
    	var message = {};
    	$scope.loadingData = true;
    	var pGetInfo = HttpService.templateAccessAPI( url, message );
    	pGetInfo.then( function( result ){
    		$log.debug( 'get basic info success', result );
    		$scope.businessLicense = result.business_license;
    		$scope.institutionCode = result.organization_code;
    		$scope.taxId = result.tax_id;
    		$scope.businessEntity = result.legal_person_name;
    		$scope.businessEntityIdCard = result.legal_person_id_number;
    		if( result.business_license_img_url != '' ){
    			$scope.imageUrl.businessLicense = decodeURIComponent( result.business_license_img_url );
    		}
    		if( result.organization_code_img_url != '' ){
    			$scope.imageUrl.institutionCode = decodeURIComponent( result.organization_code_img_url );
    		}
    		if( result.tax_id_img_url != '' ){
    			$scope.imageUrl.taxId = decodeURIComponent( result.tax_id_img_url );
    		}
    		if( result.legal_person_id_front_img_url != '' ){
    			$scope.imageUrl.businessEntityIdCard1 = decodeURIComponent( result.legal_person_id_front_img_url );
    		}
    		if( result.legal_person_id_back_img_url != '' ){
    			$scope.imageUrl.businessEntityIdCard2 = decodeURIComponent( result.legal_person_id_back_img_url );
    		}
    		// $scope.$apply();
    	}, function( reason ){
			$log.debug( 'get basic info failed', reason );
			PierUtil.popup( { title: '', content: reason.message } );
    	} ).then( function(){
    		$scope.loadingData = false;
    	} )
    }
    
	$scope.businessLisenceUploader = PierUtil.uploader( {
		type: 'business_license',
		targetObj: $('#businessLisence')
	}, function( response ){
		$log.debug( 'upload business_lisence response', response );
		$scope.imageUrl.businessLicense = decodeURIComponent( response.result.image_url );
		$scope.$apply();
	});

	$scope.institutionCodeUploader = PierUtil.uploader( {
		type: 'organization_code',
		targetObj: $('#institutionCode')
	}, function( response ){
		$log.debug( 'upload organization_code response', response );
		$scope.imageUrl.institutionCode = decodeURIComponent( response.result.image_url );
		$scope.$apply();
	});

	$scope.taxIdUploader = PierUtil.uploader( {
		type: 'tax_id',
		targetObj: $('#taxId')
	}, function( response ){
		$log.debug( 'upload tax_id response', response );
		$scope.imageUrl.taxId = decodeURIComponent( response.result.image_url );
		$scope.$apply();
	});

	$scope.businessEntityIdCard1Uploader = PierUtil.uploader( {
		type: 'legal_person_front',
		targetObj: $('#businessEntityIdCard1')
	}, function( response ){
		$log.debug( 'upload legal_person_front response', response );
		$scope.imageUrl.businessEntityIdCard1 = decodeURIComponent( response.result.image_url );
		$scope.$apply();
	});

	$scope.businessEntityIdCard2Uploader = PierUtil.uploader( {
		type: 'legal_person_back',
		targetObj: $('#businessEntityIdCard2')
	}, function( response ){
		$log.debug( 'upload legal_person_back response', response );
		$scope.imageUrl.businessEntityIdCard2 = decodeURIComponent( response.result.image_url );
		$scope.$apply();
	});

    $scope.uploadImage = function( _obj ){
    	var url = ApiUrl.getUserAuth;
    	var pAuth = HttpService.templateAccessAPI( url, {} );
    	pAuth.then( function( result ){
    		$log.debug( 'get user auth', result );
		    $scope._merchant_id = result.merchant_id;
		    $scope._session_token = result.session_token;
		    _obj.settings('formData', {merchant_id:$scope._merchant_id,session_token:$scope._session_token});
    	}, function( reason ){
			$log.debug( 'get user auth failed', reason );
    	} ) 
    }
    $scope.getBasicInfo();
})
.controller( 'Activation3Controller', function( $scope, $log, ProvinceData, HttpService, ApiUrl, PierUtil, UploaderPlugin, $timeout, $state ){
	$scope.saveInfoFlag = false;
	$scope.isLegalPerson = false;
	$scope.serviceRule = false;
	UploaderPlugin.initUploaderPlugin();

	$scope.imageUrl = {
		attorney: '../images/企业委托书.png',
		agentFront: '../images/身份证正面.png',
		agentBack: '../images/身份证背面.png'
	};

	$scope.changeLegalPerson = function(){
    	$( '#agentInfo' ).slideToggle(400);
    }

	$scope.submitAll = function(){
		$log.debug( 'serviceRule', $scope.serviceRule );
        if( !PierUtil.notEmpty( [$scope.agentPhone,$scope.smsCode]) || !$scope.serviceRule ) return;
		$log.debug( 'serviceRule', $scope.serviceRule );
		$log.debug( 'isLegalPerson', $scope.isLegalPerson );
		if( !$scope.isLegalPerson ){
			if( !PierUtil.notEmpty( [$scope.agentName,$scope.agentIdCard]) ) return;
		}
		var url = ApiUrl.saveAgentInfo;
		var message = {
			agent_name: $scope.agentName || '',
			agent_phone: $scope.agentPhone,
			sms_code: $scope.smsCode,
			agent_id_number: $scope.agentIdCard || '',
			agent_type: $scope.isLegalPerson?0:1
		};
		var pSaveInfo = HttpService.templateAccessAPI( url, message );
		pSaveInfo.then( function( result ){
			$log.debug( 'merchant save information3 success', result );
			// $state.go();

		}, function( reason ){
            $log.debug( 'merchant save information3 failed', reason );
            $scope.errorMsg = reason.message;
		} )
	}
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
    	if( $scope.agentPhone == '' || $scope.phoneLength != $scope.agentPhone.length ){
    		$scope.phoneError = true;
    		return;
    	}
    	$scope.sendCodeFlag = true;
    	var url = ApiUrl.smsAgentPhone,
    	message = {
    		agent_phone: $scope.agentPhone,
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
	}

	$scope.attorneyUploader = PierUtil.uploader( {
		type: 'attorney',
		targetObj: $('#attorneyUploader')
	}, function( response ){
		$log.debug( 'upload attorney response', response );
		$scope.imageUrl.attorney = decodeURIComponent( response.result.image_url );
		$scope.$apply();
		
	});

	$scope.agentFrontUploader = PierUtil.uploader( {
		type: 'agent_front',
		targetObj: $('#agentFrontUploader')
	}, function( response ){
		$log.debug( 'upload agent_front response', response );
		$scope.imageUrl.agentFront = decodeURIComponent( response.result.image_url );
		$scope.$apply();
	});

	$scope.agentBackUploader = PierUtil.uploader( {
		type: 'agent_back',
		targetObj: $('#agentBackUploader')
	}, function( response ){
		$log.debug( 'upload agent_back response', response );
		$scope.imageUrl.agentBack = decodeURIComponent( response.result.image_url );
		$scope.$apply();
	});

    $scope.uploadImage = function( _obj ){
    	var url = ApiUrl.getUserAuth;
    	var pAuth = HttpService.templateAccessAPI( url, {} );
    	pAuth.then( function( result ){
		    $scope._merchant_id = result.merchant_id;
		    $scope._session_token = result.session_token;
		    _obj.settings('formData', {merchant_id:$scope._merchant_id,session_token:$scope._session_token});
    	}, function( reason ){
			$log.debug( 'get user auth failed', reason );
			$scope.$apply();
    	} ) 
    }

	$scope.getBasicInfo = function(){
    	var url = ApiUrl.merchantInfo;
    	var message = {};
    	var pGetInfo = HttpService.templateAccessAPI( url, message );
    	pGetInfo.then( function( result ){
    		$log.debug( 'get basic info success', result );
    		$scope.agentName = result.agent_name;
    		$scope.agentPhone = result.agent_phone;
    		$scope.agent_id_number = result.agent_id_number;
    		if( result.power_of_attorney != '' ){
    			$scope.imageUrl.attorney = decodeURIComponent( result.power_of_attorney );
    		}
    		// $scope.$apply();

    	}, function( reason ){
			$log.debug( 'get basic info failed', reason );
    	} )
    }
    $scope.getBasicInfo();
})
