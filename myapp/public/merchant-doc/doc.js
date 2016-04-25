angular.module( 'DocApp' , ['ui.router'])

.config( function( $urlRouterProvider, $stateProvider, $logProvider  ){
	$logProvider.debugEnabled( false );
	$urlRouterProvider.otherwise( '/' );
	$stateProvider
		.state( '/', {
			url: '/',
			templateUrl: '../merchant-doc/content/register-flow.html'
		} )
		.state( 'web_interface', {
			url: '/web_interface',
			templateUrl: '../merchant-doc/content/web-interface.html'
		} )
		.state( 'ios_interface', {
			url: '/ios_interface',
			templateUrl: '../merchant-doc/content/ios-interface.html'
		} )
		.state( 'signature', {
			url: '/signature',
			templateUrl: '../merchant-doc/content/signature.html'
		} )
		.state( 'web_doc', {
			url: '/web_doc',
			templateUrl: '../merchant-doc/content/web_doc.html',
			controller: 'WebController',
		} )
		.state( 'server_doc', {
			url: '/server_doc',
			templateUrl: '../merchant-doc/content/server_doc.html'
		} )
		.state( 'java_doc', {
			url: '/java_doc',
			templateUrl: '../merchant-doc/content/java_doc.html'
		} )
		.state( 'key_gener', {
			url: '/key_gener',
			templateUrl: '../merchant-doc/content/key_gener.html'
		} )
} )

.controller( 'DocController', function( $scope, $log, $state, $location, $rootScope ){
    $scope.$state = $state;
    $scope.switchLocation = function( obj ){
    	if( obj.isActive === true || obj.url === '' ) return;
    	obj.isActive = true;
    	$scope.tempObj.isActive = false;
    	$scope.tempObj = obj;
    	$state.go( obj.url );
    }
    var name = $state.url;
    $rootScope.$on( '$stateChangeStart', function( event, toState, toParams, fromState, fromParams ){
    	
    	if( toState.name != $scope.tempObj.url ){
    		$scope.getSideBarObj( toState.name );
    	}
    })


    $scope.getSideBarObj = function( name ){
        angular.forEach( $scope.sidebarData, function(value, key) {
		    angular.forEach( value.submenu, function( val, ke ){
                if( val.url == name ){
                	 $scope.switchLocation( val );
                	 return;
                }
                if( val.isActive ){
                	angular.forEach( val.submenu, function( v, k ){
                		if( v.url == name ){
                			$scope.switchLocation( v );
		                	return;
                		}
                	} )
                }
		    })
		} );
    }

    $scope.sidebarData =  [
    {
    	id: "010000",
		level: "1",
		content: "商家接入注册流程",
		hasSub:true,
		style: "link level1",
		link: "",
		url: "start",
		isActive: false,
		icon: "fa fa-flag fa-lg",
		submenu: [
		{
			id: "010100",
			level: "2",
			content: "注册流程",
			url:"/",
			hasSub:false,
			style: "link level2",
			isActive: true,
			submenu: null
		} ]
	}, {
    	id: "020000",
		level: "1",
		content: "开发指南",
		hasSub:true,
		style: "link level1",
		url: "start",
		isActive: false,
		icon: "fa  fa-key fa-lg",
		submenu: [
			{
				id: "020100",
				level: "2",
				content: "web接入",
				url:"web_interface",
				hasSub:false,
				style: "link level2",
				isActive: false,
				submenu: null
			},
			// {
			// 	id: "020200",
			// 	level: "2",
			// 	content: "iOS 接入",
			// 	url: "ios_interface",
			// 	hasSub:false,
			// 	style: "link level2",
			// 	isActive: false,
			// 	submenu: null
			// },
			{
				id: "020300",
				level: "2",
				content: "签名机制",
				url: "signature",
				hasSub:false,
				style: "link level2",
				isActive: false,
				submenu: null
			} ]
		}, {
    	id: "030000",
		level: "1",
		content: "文档Demo",
		hasSub:true,
		style: "link level1",
		url: "start",
		isActive: false,
		icon: "fa  fa-book fa-lg",
		submenu: [
			{
				id: "030100",
				level: "2",
				content: "web文档和demo",
				url:"web_doc",
				hasSub:false,
				style: "link level2",
				isActive: false,
				submenu: null
			}
			,{
				id: "030200",
				level: "2",
				content: "server端文档",
				url: "server_doc",
				hasSub:false,
				style: "link level2",
				isActive: false,
				submenu: null
			}
			,{
				id: "030300",
				level: "2",
				content: "公钥和私钥的生成",
				url: "key_gener",
				hasSub:false,
				style: "link level2",
				isActive: false,
				submenu: null
			} 
			]
		}
	];
	$scope.tempObj = $scope.sidebarData[0].submenu[0];

    $scope.errorCodeData = [
	    {
	    	code: '1001',
	    	msg: 'Session expired.'
	    }, {
	    	code: '1007',
	    	msg: 'User was not found.'
	    }, {
	    	code: '1030',
	    	msg: 'Login failed.'
	    }, {
	    	code:'1060',
	  	    msg:'Invalid or expired auth_token.'
	    }, {
            code:'1068',
	  	    msg:'Transaction failed - internal error.'
	    }, {
            code:'1081',
	  	    msg:'Insufficient funds or unable to locate user account.'
	    }, {
            code:'1082',
	  	    msg:'Insufficient funds to deduct fees or unable to locate merchant account.'
	    }, {
            code:'1084',
	  	    msg:'Internal error when calculating merchant fees.'
	    }, {
	    	code: '1110',
	    	msg: 'Invalid verification code.'
	    }, {
	  	    code:'1111',
	  	    msg:'[SMS] message code is expired.'
	    }, {
            code:'1140',
	  	    msg:'Phone has already sign up with Pier (Error when trying to sign up again with the same phone).'
	    }, {
	    	code: '2004',
	    	msg: 'Verification code is used or expired.'
	    }
    ];

    $scope.webUpdateLogs = [{
    	date: '2015-9-17',
    	description: 'js sdk 修改回调'
    }];
    $scope.iOSUpdateLogs = [{
    	date: '2015-9-17',
    	description: 'iOS bug 修复'
    }];

    
} )
.controller('WebController', function($scope){
	var randomString = 'ORTest';
    for(var i=0; i<6;i++){
      randomString += Math.ceil( Math.random()*10 );
    }
        PIER.checkout({
          money_order: "0.01",
          merchant_id: "MC0000001409",
          merchant_logo: 'http://pierup.cn/images/android-app-download.png',
          api_key: "787fa484-1a3f-11e5-ba25-3a22fd90d682",
          no_order: "mk-test-787fa390-1a3f-11e5-ba25-3a22fd90d682",
          name_goods: "测试商品",
          valid_order: "10080",
          sign_type: "RSA",
          sign: "test_sign",
          dt_order: "20160311164511",
          charset: "UTF-8",
          info_order: "两只毛笔和一只铅笔"
          // pier_btn_id: 'payBtn'
        }, function( result ){
          if( result === 'success' ){
            //payment success handler
            alert('支付成功')
          } 
          if( result === 'failed' ){
            //payment failed  handler
            alert('支付失败')
          }
          if( result === 'uncompleted' ){
            //payment uncomplete handler
            alert('支付未完成')
          }
        }); 
});




