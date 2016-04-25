angular.module( 'MerchantApp', [ 'ui.router', 'pier.merchant', 'ui.bootstrap'] )
.config( function( $urlRouterProvider, $stateProvider, $logProvider, $httpProvider, $locationProvider ){
	$logProvider.debugEnabled( false );
	$urlRouterProvider.otherwise( '/' );
	$stateProvider
		.state( 'home', {
			url: '/',
			templateUrl: '../pier_merchant/view/account.html',
			controller: 'AccountController'
		} )
		.state( 'basic-info', {
			url: '/basic-info',
			templateUrl: '../pier_merchant/view/basic-info.html',
			controller: 'BasicInfoController'
		} )
		.state( 'activation', {
			url: '/activation',
			templateUrl: '../pier_merchant/view/activation.html',
			controller: 'ActivationController'
		} )
		.state( 'activationWaiting', {
			url: '/activationWaiting',
			templateUrl: '../pier_merchant/view/activation-waiting.html',
			// controller: 'ActivationWaitingController'
		} )
		.state( 'bankaccount', {
			url: '/bankaccount',
			templateUrl: '../pier_merchant/view/bankaccount.html',
			// controller: 'AccountController'
		} )
		.state( 'resetPassword', {
			url: '/resetPassword',
			templateUrl: '../pier_merchant/view/resetPassword.html',
			controller: 'ChangePasswordController'
		} )
		.state( 'customers', {
			url: '/customers',
			templateUrl: '../pier_merchant/view/customers.html',
			controller: 'CustomerController'
		} )
		.state( 'transaction', {
			url: '/transaction',
			templateUrl: '../pier_merchant/view/transaction.html',
			controller: 'TransactionController'
		} )
		.state( 'transfer', {
			url: '/transfer',
			templateUrl: '../pier_merchant/view/transfer.html',
			// controller: 'AccountController'
		} )
		.state( 'key-manager', {
			url: '/key-manager',
			templateUrl: '../pier_merchant/view/key-manager.html',
			controller: 'KeyManagerController'
		})
		.state( 'pre-shipping-order', {
			url: '/pre-shipping-order',
			templateUrl: '../pier_merchant/view/pre-shipping-order.html',
			controller: 'PreShippingOrderController'
		})
		.state( 'cancel-order', {
			url: '/cancelled-order',
			templateUrl: '../pier_merchant/view/cancelled-order.html',
			controller: 'CancelledOrdersController'
		} )
		.state( 'order-search', {
			url: '/order-search',
			templateUrl: '../pier_merchant/view/order-search.html',
			controller: 'OrderSearchController'
		})
} )
.run( function( $rootScope, $state, $log, $http, PierUtil, $q ){
    var getStatusBit = function(){
		var url = '/merchants/getStatusBit',
		message = {};
		var d = $q.defer();
		$http.post( url, message )
		.success(function(data, status, headers, config) {
			$log.debug( 'get status_bit success', data.result.status_bit );
			d.resolve( data.result.status_bit );
		})
		.error(function(data, status, headers, config) {
		});
		return d.promise;
	}
	$rootScope.$on( '$stateChangeStart', function( event, toState, toParams, fromState, fromParams ) {
		if ( toState.name === 'activation' ){
			var _q = getStatusBit();
			_q.then(function( result ){
				if( PierUtil.getBinBit( result, 4 ) == 1 ){
					event.preventDefault();
					if( PierUtil.getBinBit( result, 2 ) == 1 ){
						$state.go( 'basic-info' );
					}else{
						$state.go( 'activationWaiting' );
					}
				}
			})
			return;
		}

		if( toState.name === 'activationWaiting' ){
            var _q = getStatusBit();
			_q.then(function( result ){
				if( PierUtil.getBinBit( result, 2 ) == 1 ){
					if( PierUtil.getBinBit( result, 2 ) == 1 ){
						event.preventDefault();
						$state.go( 'basic-info' );
					}
				}else if( PierUtil.getBinBit( result, 4 ) != 1 ){
					event.preventDefault();
					$state.go( 'activation' );
				}
			})
			return;
		}

		if( toState.name === 'basic-info' ){
            var _q = getStatusBit();
			_q.then(function( result ){
				if( PierUtil.getBinBit( result, 2 ) != 1 ){
					event.preventDefault();
					$state.go( 'activationWaiting' );
				}
			})
			return;
		}
	})

} )
.controller( 'DashboardController', function( $scope, $log, $state, $location, $http, PierUtil ){
	$scope.sidebars = [ {
		title:'交易信息',
		hasSub: true,
		url: '',
		style: '',
		subItems: [{
			title: '我的账户',
			hasSub: false,
			url: 'home',
			style: '',
			subItems:[]
		}, {
			title: '客户信息',
			hasSub: false,
			url: 'customers',
			style: '',
			subItems:[],
		}, {
			title: '交易记录',
			hasSub: false,
			url: 'transaction',
			style: '',
			subItems:[]
		}
		// , {
		// 	title: '提款记录',
		// 	hasSub: false,
		// 	url: 'transfer',
		// 	style: '',
		// 	subItems:[]
		// }
		]
	}, {
		title:'订单管理',
		hasSub: true,
		url: '',
		style: '',
		subItems: [{
			title: '待发货订单',
			hasSub: false,
			url: 'pre-shipping-order',
			style: '',
			subItems:[]
		},{
			title: '已取消订单',
			hasSub: false,
			url: 'cancel-order',
			style: '',
			subItems:[]
		},{
			title: '订单查询',
			hasSub: false,
			url: 'order-search',
			style: '',
			subItems:[],
		}]
	}, {
		title:'账户信息',
		hasSub: true,
		url: '',
		style: '',
		subItems: [{
			title: '基本信息',
			hasSub: false,
			url: 'basic-info',
			style: '',
			subItems:[]
		}, {
			title: '秘钥管理',
			hasSub: false,
			url: 'key-manager',
			style: '',
			subItems:[]
		}
		// , {
		// 	title: '银行信息',
		// 	hasSub: false,
		// 	url: 'bankaccount',
		// 	style: '',
		// 	subItems:[]
		// }
		, {
			title: '修改密码',
			hasSub: false,
			url: 'resetPassword',
			style: '',
			subItems:[]
		}]
	}
	];

	$scope.selectedItem = $scope.sidebars[0].subItems[0];
	$scope.initPath = function(){
		if( $location.$$path.split('/')[1] != '' ){
			angular.forEach( $scope.sidebars, function(value, key) {
			    if( value.hasSub ){
					angular.forEach( value.subItems, function(v, k){
		                if( v.url == $location.$$path.split('/')[1] ){
		                	$scope.selectedItem = v;
		                	$scope.switchPanel( $scope.selectedItem );
		                	return;
		                }
					})
			    }
			});
		}
		$scope.switchPanel($scope.selectedItem)
	}
    
	$scope.switchPanel = function( obj ){
	    $scope.selectedItem.style = '';
	    obj.style = 'active';
	    $scope.selectedItem = obj;
	    $state.go( $scope.selectedItem.url );
	}
	$scope.initPath();

	$scope.getStatusBit = function(){
		var url = '/merchants/getStatusBit',
		message = {};
		$http.post( url, message )
		.success(function(data, status, headers, config) {
			$log.debug( 'get status_bit success', data );
			$log.debug( 'get status_bit success', PierUtil.getBinBit( data.result.status_bit ) );
			if( PierUtil.getBinBit( data.result.status_bit, 4 ) != 1 ){
				$scope.sidebars[1].subItems[0].url = 'activation';
				$scope.switchPanel( $scope.sidebars[1].subItems[0]);
			}else if( PierUtil.getBinBit( data.result.status_bit, 2 ) != 1 ){
				$scope.sidebars[1].subItems[0].url = 'activationWaiting';
				$scope.switchPanel( $scope.sidebars[1].subItems[0]);
			}
			
		})
		.error(function(data, status, headers, config) {
			$scope.signInFlag = false;
		});
	}
	$scope.getStatusBit();

} )
angular.module( 'pier.merchant', ['pier.account', 'pier.business']);
angular.module( 'pier.account', []);
angular.module( 'pier.business', []);