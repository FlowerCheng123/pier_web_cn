angular.module( 'pier.business', [])
.controller( 'AccountController', function( $http, $scope, $log, ApiUrl, PierUtil, HttpService, $uibModal ){
	$scope.loadingData = false;
	$scope.dateType = {
	    D: true,//for day
	    M: false// for month
	};
    $scope.dateTemp = 'D';
    $scope.chooseDataType = function( name ){
        $scope.dateType[ $scope.dateTemp ]= false;
        $scope.dateType[ name ] = true;
        $scope.dateTemp = name;
        $scope.getDashboardInfo();
    }
    // date widgets
    $scope.calender = {
	    error: false,
	    errorMsg: '',
	    opened: {
	      startDate: false,
	      endDate: false
	    },
	    dateFormat: 'MM/dd/yyyy',
	    dateOptions: {
	      formatYear: 'yy',
	      startingDay: 1
	    },
	    open: function($event, which) {
	      $event.preventDefault();
	      $event.stopPropagation();
	      for ( k in $scope.calender.opened ) {
	        if ( $scope.calender.opened.hasOwnProperty( k ) ) {
	          if ( k == which ) {
	            $scope.calender.opened[k] = true;
	          } else {
	            $scope.calender.opened[k] = false;
	          }
	        }
	      }
	    },
	    today: function() { 
	      $scope.calender.startDate =  new Date();
	      $scope.calender.endDate =  new Date();
	    }
    };
    // date config
    var endDate =  new Date();
    var startDate = new Date();
    var nowMonth = endDate.getMonth();
    startDate.setMonth( nowMonth -1 );
    startDate = PierUtil.date2string( startDate );
    endDate = PierUtil.date2string( endDate );

    $scope.startDate = startDate;
    $scope.endDate = endDate;
    $scope.maxDate = endDate;

    //pagnation config
    $scope.numRecords = 0;
    $scope.pageSizeOptions = [ { size: 10 }, { size: 20 }, { size: 30 } ];
    $scope.pageSize = $scope.pageSizeOptions[0];
    $scope.currentPage = 1;
    $scope.numPages = 1;

    $scope.$watch( 'startDate', function( newVal, oldVal, scope ){
        if( angular.isObject(newVal) ){
        	$scope.startDate = PierUtil.date2string( newVal );
        }
    } );

    $scope.$watch( 'endDate', function( newVal, oldVal, scope ){
        if( angular.isObject(newVal) ){
        	$scope.endDate = PierUtil.date2string( newVal );
        }
    } );


    // echart path config
    require.config({
        paths: {
            echarts: '../bower_components/echarts/build/dist'
        }
    });

    $scope.initData = function( filledData, options ){
    	$log.debug( 'revenue data', filledData );
	    var min = 0, max = 0,
	    legendData = [],
	    seriesData = [],
	    _startDate = angular.copy( $scope.startDate ),
	    _endDate = angular.copy( $scope.endDate ),
	    xAxisData = [],
	    yAxisData = [],
	    hasData = false,
	    dateArray = [];

	    angular.forEach( filledData, function( value, key ){
	        if( parseFloat( value.val ) != 0  ){
		        hasData = true;
		        return;
	        }
	    } )  

	    if( hasData ){
	        angular.forEach( filledData, function( value, key ){
		        var tempNum = parseFloat(value.val);
		        min = tempNum>min? min:tempNum;
		        max = tempNum<max? max:tempNum;
		        seriesData.push( parseFloat(value.val) );
		    } )
	        max = Math.ceil(max/10)*10;
	        xAxisData = $scope.dateArray;
	    }else{
	        for( var i=0;i<5;i++){
	            seriesData.push(0);
	        }
	        xAxisData.push( _startDate );
	        xAxisData.push( _endDate );
	    }  
	    $log.debug( 'xAxisData', $scope.dateArray );  
	    var option = {
	        title : {
		        text: options.title,
		        textStyle:{
		          fontWeight:100,
		          fontSize: 18
		        },
		        subtext: '',
		        x:'center'
		    },
	        color: ['#7b37a6'],
	        grid:{
		        borderWidth:0,
		        x:60,
		        y:40,
		        x2:30,
		        y2:60
	        },
	        tooltip : {
	            trigger: 'axis'
	        },
	        legend: {
	            data:['','','']
	        },
	        toolbox: {
		        show : false,
		        feature : {
		            mark : {show: false},
		            dataView : {show: false, readOnly: false},
		            magicType : {show: false, type: ['line', 'bar', 'stack', 'tiled']},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
	        },
	        calculable : false,
	        xAxis : [
		        {
		            type : 'category',
		            boundaryGap : false,
		            data : xAxisData,
		            name: 'time',
		            splitNumber: 28,
		            axisTick:{
		              show:true,
		              interval: '10',
		              length:1
		            },
		            lineStyle: {
		              color:'#000',
		              width: 2,
		              type: 'solid'
		            }
		        }
	        ],
	        yAxis : [
		        {
		            type : 'value',
		            min:min,
		            max:max
		        }
	        ],
	        series : [
		        {
		            name:options.title,
		            type:'line',
		            smooth:true,
		            itemStyle: {normal: {areaStyle: {type: 'default'}}},
		            data:seriesData
		        }
	      ]
	    };
	    return option;
    }
 // start pie chart
  require(
      [
          'echarts',
          'echarts/chart/line' 
      ],
      function (ec) {
          // this function is for loading the graphic 
        $scope.initMyChart = function( id, data, options ){
          var myChart = ec.init(document.getElementById(id)); 
          myChart.setOption(  $scope.initData( data,options ) ); 
        }

        $scope.getDashboardInfo = function(){
	    	var url = ApiUrl.getMerchantDashboard;
	    	var message = {
	    		start_date: $scope.startDate,
	    		end_date: $scope.endDate,
	    		date_type: $scope.dateTemp
	    	};
	    	$scope.loadingData = true;
	    	var pGetDashboard = HttpService.templateAccessAPI( url, message );
	    	pGetDashboard.then( function( result ){
	    		$log.debug( 'merchant get dashboard success', result );
	    		$scope.totalCustomers = result.total_customers;
	    		$scope.totalTransactions = result.total_success_transactions;
	    		$scope.totalRevenue = result.gross_revenue;
		        $scope.grossVolData = [];
		        $scope.transactionData = [];
		        $scope.customerData = [];
		        $scope.dateArray = [];
		      
		        if ( result.items ) {
		            angular.forEach( result.items, function( key, value ) {
		              var ts = parseInt( key.time_key );
		              $scope.grossVolData.push( { date: ts, val: parseFloat( key.gross_amount ) } ); 
		              $scope.transactionData.push( { date: ts, val: parseFloat( key.success_charge_total ) } );
		              $scope.customerData.push( { date: ts, val: parseFloat( key.customer_created_total ) } );
		              $scope.dateArray.push( PierUtil.date2string( key.time_key ) );
		            } );
		        }
		        $scope.initMyChart( 'revenueGraphic', $scope.grossVolData, { title:'收入（元）', unit: '元'});
		        $scope.initMyChart( 'transactionGraphic', $scope.transactionData, { title:'交易数量（笔）', unit: '笔'});
		        $scope.initMyChart( 'customerGraphic', $scope.customerData, { title:'客户数量（个）', unit: '个'});

	    	}, function( reason ){
	    		$log.debug( 'merchant get dashboard failed', reason );
	    	}).then( function(){
	    		$scope.loadingData = false;
	    	} )
	    };
	    $scope.getDashboardInfo();
    }
  );

})
.controller( 'CustomerController', function( $http, $scope, $log, ApiUrl, PierUtil, HttpService, $uibModal ){
	$scope.loadingData = false;
  // date widgets
    $scope.calender = {
	    error: false,
	    errorMsg: '',
	    opened: {
	      startDate: false,
	      endDate: false
	    },
	    dateFormat: 'MM/dd/yyyy',
	    dateOptions: {
	      formatYear: 'yy',
	      startingDay: 1
	    },
	    open: function($event, which) {
	      $event.preventDefault();
	      $event.stopPropagation();
	      for ( k in $scope.calender.opened ) {
	        if ( $scope.calender.opened.hasOwnProperty( k ) ) {
	          if ( k == which ) {
	            $scope.calender.opened[k] = true;
	          } else {
	            $scope.calender.opened[k] = false;
	          }
	        }
	      }
	    },
	    today: function() { 
	      $scope.calender.startDate =  new Date();
	      $scope.calender.endDate =  new Date();
	    }
    };
    // date config
    var endDate =  new Date();
    var startDate = new Date();
    var nowMonth = endDate.getMonth();
    startDate.setMonth( nowMonth -1 );
    startDate = PierUtil.date2string( startDate );
    endDate = PierUtil.date2string( endDate );

    $scope.startDate = startDate;
    $scope.endDate = endDate;
    $scope.maxDate = endDate;

    //pagnation config
    $scope.numRecords = 0;
    $scope.pageSizeOptions = [ { size: 10 }, { size: 20 }, { size: 30 } ];
    $scope.pageSize = $scope.pageSizeOptions[0];
    $scope.currentPage = 1;
    $scope.numPages = 1;

    $scope.$watch( 'startDate', function( newVal, oldVal, scope ){
        if( angular.isObject(newVal) ){
        	$scope.startDate = PierUtil.date2string( newVal );
        }
    } );

    $scope.$watch( 'endDate', function( newVal, oldVal, scope ){
        if( angular.isObject(newVal) ){
        	$scope.endDate = PierUtil.date2string( newVal );
        }
    } )

    //for fetch data in pagination
    $scope.$watch( 'currentPage', function( newVal, oldVal, scope){
        if( newVal!=oldVal ){
        	if( newVal > $scope.numPages ){
        		$scope.currentPage = $scope.numPages;
        	}
	        $scope.getCustomers();
        }
    } )
    $scope.$watch( 'pageSize', function( newVal, oldVal, scope){
        if( newVal!=oldVal ){
            $scope.currentPage = 1;
            $scope.getCustomers();
        }
    } )
    $scope.previousPage = function(){
	    if( $scope.currentPage > 1 ) $scope.currentPage -= 1;
    }
    $scope.nextPage = function(){
	    if( $scope.currentPage < $scope.numPages ) $scope.currentPage += 1;
    }

    //start, end format mm/dd/yyyy
    $scope.getCustomers = function() {
    	var url = ApiUrl.getCustomers;
	    var message = {
	        start_date: $scope.startDate,
	        end_date: $scope.endDate,
	        start: ($scope.currentPage-1)*$scope.pageSize.size,
	        limit: $scope.pageSize.size
	    };
	    $scope.loadingData = true;
	    var pCustomers = HttpService.templateAccessAPI( url, message );
	    pCustomers.then( function( result ){
	    	$log.debug( 'merchant get customers success', result );
	    	$scope.numRecords = result.total_customers;
	    	$scope.customers = result.items;
	    	$scope.numPages = Math.ceil( $scope.numRecords/$scope.pageSize.size );
	    	$log.debug( '$scope.numPages', $scope.numPages )
	    }, function( reason ){
	    	$log.debug( 'merchant get customers failed', reason );
	    }).then(function(){
	    	$scope.loadingData = false;
	    })
    };
    $scope.getCustomers();

    $scope.getTransactionDetail = function( customer ){
	    var modalInstance = $uibModal.open({
	    	size: 'lg',
			controller: 'CustomerTransactionController',
			templateUrl: '../pier_merchant/view/customer-transaction.html',
			backdrop: 'static',
			resolve:{
                UserId: function(){
                	return customer.id
                }
            }
	    })
    }
} )
.controller('CustomerTransactionController', function( $scope, $log, PierUtil, HttpService, $uibModalInstance, ApiUrl, UserId ){
	$scope.loadingData = false;
	$scope.customerList = [];
	$scope.customerListShow = [];
	$scope.totalPages = 1;
	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.close = function(){
		$uibModalInstance.close();
	};

	$scope.getCustomerTransaction = function(){
		var url = ApiUrl.getCustomerTransaction;
		var message = {
			user_id: UserId,
			start_date: '2015-01-01'
		};
		$scope.loadingData = true;
		var pGet = HttpService.templateAccessAPI( url, message );
		pGet.then( function( result ){
			$log.debug( 'merchant get customer transaction success!', result );
			$scope.customerList = result.items;
			$scope.customerName = result.name;
			$scope.customerPhone = result.phone;
			$scope.customerEmail = result.email;
			$scope.customerAmount = result.total_amount;
			$scope.totalCount = result.total_count;

			$scope.customerListShow = $scope.customerList.slice( ($scope.currentPage-1)*$scope.pageSize, $scope.currentPage*$scope.pageSize );
			$scope.totalPages = Math.ceil($scope.totalCount/$scope.pageSize);
		}, function( reason ){
			$log.debug( 'merchant get customer transaction failed!', reason );
		}).then( function(){
			$scope.loadingData = false;
		} )
	};

	$scope.nextPage = function(){
		if( $scope.currentPage < $scope.totalPages ){
			$scope.currentPage += 1;
			$log.debug(($scope.currentPage-1)*$scope.pageSize, $scope.pageSize)
			$scope.customerListShow = $scope.customerList.slice( ($scope.currentPage-1)*$scope.pageSize, $scope.currentPage*$scope.pageSize );
		}
	}
	$scope.previousPage = function(){
		if( $scope.currentPage > 1 ){
			$scope.currentPage -= 1;
			$scope.customerListShow = $scope.customerList.slice( ($scope.currentPage-1)*$scope.pageSize, $scope.currentPage*$scope.pageSize );
		}
	}

	$scope.getCustomerTransaction();
} )
.controller( 'TransactionController', function( $http, $scope, $log, ApiUrl, PierUtil, HttpService, $uibModal ){
	$scope.loadingData = false;
  // date widgets
    $scope.calender = {
	    error: false,
	    errorMsg: '',
	    opened: {
	      startDate: false,
	      endDate: false
	    },
	    dateFormat: 'MM/dd/yyyy',
	    dateOptions: {
	      formatYear: 'yy',
	      startingDay: 1
	    },
	    open: function($event, which) {
	      $event.preventDefault();
	      $event.stopPropagation();
	      for ( k in $scope.calender.opened ) {
	        if ( $scope.calender.opened.hasOwnProperty( k ) ) {
	          if ( k == which ) {
	            $scope.calender.opened[k] = true;
	          } else {
	            $scope.calender.opened[k] = false;
	          }
	        }
	      }
	    },
	    today: function() { 
	      $scope.calender.startDate =  new Date();
	      $scope.calender.endDate =  new Date();
	    }
    };
    // date config
    var endDate =  new Date();
    var startDate = new Date();
    var nowMonth = endDate.getMonth();
    startDate.setMonth( nowMonth -1 );
    startDate = PierUtil.date2string( startDate );
    endDate = PierUtil.date2string( endDate );

    $scope.startDate = startDate;
    $scope.endDate = endDate;
    $scope.maxDate = endDate;

    //pagnation config
    $scope.numRecords = 0;
    $scope.pageSizeOptions = [ { size: 10 }, { size: 20 }, { size: 30 } ];
    $scope.pageSize = $scope.pageSizeOptions[0];
    $scope.currentPage = 1;
    $scope.numPages = 1;

    $scope.$watch( 'startDate', function( newVal, oldVal, scope ){
        if( angular.isObject(newVal) ){
        	$scope.startDate = PierUtil.date2string( newVal );
        }
    } );

    $scope.$watch( 'endDate', function( newVal, oldVal, scope ){
        if( angular.isObject(newVal) ){
        	$scope.endDate = PierUtil.date2string( newVal );
        }
    } )

    //for fetch data in pagination
    $scope.$watch( 'currentPage', function( newVal, oldVal, scope){
        if( newVal!=oldVal ){
        	if( newVal > $scope.numPages ){
        		$scope.currentPage = $scope.numPages;
        	}
	        $scope.getTransactions();
        }
    } )
    $scope.$watch( 'pageSize', function( newVal, oldVal, scope){
        if( newVal!=oldVal ){
            $scope.currentPage = 1;
            $scope.getTransactions();
        }
    } )
    $scope.previousPage = function(){
	    if( $scope.currentPage > 1 ) $scope.currentPage -= 1;
    }
    $scope.nextPage = function(){
	    if( $scope.currentPage < $scope.numPages ) $scope.currentPage += 1;
    }


    $scope.getTransactions = function(){
    	var url = ApiUrl.getTransactions;
    	var message = {
    		start_date: $scope.startDate,
	        end_date: $scope.endDate,
	        start: ($scope.currentPage-1)*$scope.pageSize.size,
	        limit: $scope.pageSize.size,
	        is_desc: 1
    	};
    	$scope.loadingData = true;
    	var pGetTransactions = HttpService.templateAccessAPI( url, message );
    	pGetTransactions.then( function( result ){
    		$log.debug( 'merchant get transaction success', result );
    		$scope.numRecords = result.total_transactions;
	    	$scope.transactions = result.items;
	    	$scope.numPages = Math.ceil( $scope.numRecords/$scope.pageSize.size );

    	}, function( reason ){
    		$log.debug( 'merchant get transaction failed', reason );

    	} ).then(function(){
    		$scope.loadingData = false;
    	})
    };

    $scope.makeRefund = function( refundObj ){
	    var modalInstance = $uibModal.open({
	    	size: 'md',
			controller: 'RefundController',
			templateUrl: '../pier_merchant/view/customer-refund.html',
			backdrop: 'static',
			resolve:{
                refundObj: function(){
                	return refundObj
                }
            }
	    })
    }

    $scope.getTransactions();

} )
.controller( 'RefundController', function( $scope, $log, PierUtil, HttpService, $uibModalInstance, ApiUrl, refundObj ){
	$scope.loadingData = false;
	$scope.refundFlag = false;
	$scope.refundObj = refundObj;

	$scope.close = function(){
		$uibModalInstance.close();
	};

	$scope.getRefundInfo = function(){
		var url = ApiUrl.refundInfo;
		var message = {
			transaction_id: refundObj.transaction_id
		};
		$scope.loadingData = true;
		var pGetRefundInfo = HttpService.templateAccessAPI( url, message );
		pGetRefundInfo.then( function( result ){
			$log.debug( 'merchant get refund info success !', result  );
			$scope.refundList = result.items;
			$scope.totalRefund = result.total_refund;

		}, function( reason ){
			$log.debug( 'merchant get refund info failed !', reason  );

		} ).then( function(){
			$scope.loadingData = false;
		} )
	};

	$scope.refund = function(){
		if( !PierUtil.notEmpty( [$scope.refundAmount, $scope.comments]) ) return;
		var url = ApiUrl.refund;
		var message = {
			transaction_id: refundObj.transaction_id,
			refund_amount: $scope.refundAmount,
			comments: $scope.comments
		};
		$scope.refundFlag = true;
		var pRefund = HttpService.templateAccessAPI( url, message );
		pRefund.then( function( result ){
			$log.debug( 'merchant refund success', result );
			$scope.getRefundInfo();
			$scope.refundAmount = '';
			$scope.comments = '';
			if( $scope.refundAmount<$scope.refundObj.amount){
				$scope.refundObj.refund_status = '1';
			}
			if( $scope.refundAmount==$scope.refundObj.amount ){
				$scope.refundObj.refund_status = '2';
			}

			
		}, function( reason ){
			$log.debug( 'merchant refund failed', reason );
			PierUtil.popup( {title: '', content: reason.message });
		} ).then( function(){
			$scope.refundFlag = false;
		} )

	}
	$scope.getRefundInfo();
})
.controller( 'ChangePasswordController', function( $scope, $log, $http, ApiUrl, PierUtil, HttpService ){

	$scope.passwordTip = false;
	$scope.passwordNotRight = false;
	$scope.passwordNotMatch = false;
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
			console.log( $scope.passwordNotRight )
		}
		if( $scope.passwordConfirm != '' || $scope.passwordConfirm != undefined ){
			$scope.validateMatch();
		}
	};

	$scope.changePassword = function(){
		$scope.validateMatch();
		$scope.validPassword();
		if( !PierUtil.notEmpty( [ $scope.password, $scope.originalPassword, $scope.passwordConfirm ] ) ) return;
		if( $scope.passwordNotRight || $scope.passwordNotMatch ) return;
		var url = ApiUrl.changePassword,
		message = {
			password: $scope.originalPassword,
			new_password: $scope.password
		};
		$scope.resetFlag = true;
		var pChange = HttpService.templateAccessAPI( url, message );
		pChange.then( function( result ){
			$log.debug( 'merchant change password success', result );
			PierUtil.popup( { title: '', content: '修改密码成功'}, function(){
				$scope.originalPassword = '';
				$scope.password = '';
				$scope.passwordConfirm = '';
			} );

		}, function( reason ){
			$log.debug( 'merchant change password failed', reason );
		}).then( function(){
			$scope.resetFlag = false;
		})
	}
} )
.controller( 'CancelledOrdersController', function( $http, $scope, $log, ApiUrl, PierUtil, HttpService, $uibModal ){
    //pagnation config
    $scope.numRecords = 0;
    $scope.pageSizeOptions = [ { size: 10 }, { size: 20 }, { size: 30 } ];
    $scope.pageSize = $scope.pageSizeOptions[0];
    $scope.currentPage = 1;
    $scope.numPages = 1;

    //for fetch data in pagination
    $scope.$watch( 'currentPage', function( newVal, oldVal, scope){
        if( newVal!=oldVal ){
        	if( newVal > $scope.numPages ){
        		$scope.currentPage = $scope.numPages;
        	}
	        $scope.getCancelledOrders();
        }
    } )
    $scope.$watch( 'pageSize', function( newVal, oldVal, scope){
        if( newVal!=oldVal ){
            $scope.currentPage = 1;
            $scope.getCancelledOrders();
        }
    } )
    $scope.previousPage = function(){
	    if( $scope.currentPage > 1 ) $scope.currentPage -= 1;
    }
    $scope.nextPage = function(){
	    if( $scope.currentPage < $scope.numPages ) $scope.currentPage += 1;
    }

	$scope.getCancelledOrders = function(){
		var url = ApiUrl.orderList;
		var message = {
	        start: ($scope.currentPage-1)*$scope.pageSize.size,
	        limit: $scope.pageSize.size,
	        list_type: 2
		};

		var pGet = HttpService.templateAccessAPI( url, message );
		pGet.then( function( result ){
			$log.debug( 'get pre ship order list success', result );
			$scope.numRecords = result.total_count;
	    	$scope.orderList = result.order_list;
	    	$scope.numPages = Math.ceil( $scope.numRecords/$scope.pageSize.size );
		}, function( reason ){
			$log.debug( 'get pre ship order list failed', reason );
		})
	};

    $scope.getOrderDetail = function( order ){
		var modalInstance = $uibModal.open({
	    	size: 'lg',
			controller: 'OrderDetailController',
			templateUrl: '../pier_merchant/view/order-detail.html',
			backdrop: 'static',
			resolve:{
                orderObj: function(){
                	return order
                }
            }
	    })
	    modalInstance.result.then(function(){
	    	
	    })
    }
	$scope.getCancelledOrders();
} )
.controller( 'PreShippingOrderController', function( $http, $scope, $log, ApiUrl, PierUtil, HttpService, $uibModal ){

	$scope.hasShipped = false;
    //pagnation config
    $scope.numRecords = 0;
    $scope.pageSizeOptions = [ { size: 10 }, { size: 20 }, { size: 30 } ];
    $scope.pageSize = $scope.pageSizeOptions[0];
    $scope.currentPage = 1;
    $scope.numPages = 1;

    //for fetch data in pagination
    $scope.$watch( 'currentPage', function( newVal, oldVal, scope){
        if( newVal!=oldVal ){
        	if( newVal > $scope.numPages ){
        		$scope.currentPage = $scope.numPages;
        	}
	        $scope.getPreShipOrderList();
        }
    } )
    $scope.$watch( 'pageSize', function( newVal, oldVal, scope){
        if( newVal!=oldVal ){
            $scope.currentPage = 1;
            $scope.getPreShipOrderList();
        }
    } )
    $scope.previousPage = function(){
	    if( $scope.currentPage > 1 ) $scope.currentPage -= 1;
    }
    $scope.nextPage = function(){
	    if( $scope.currentPage < $scope.numPages ) $scope.currentPage += 1;
    }


	$scope.getPreShipOrderList = function(){
		var url = ApiUrl.orderList;
		var message = {
	        start: ($scope.currentPage-1)*$scope.pageSize.size,
	        limit: $scope.pageSize.size,
	        list_type: $scope.listTypeForOrder
		};

		$scope.hasShipped = ($scope.listTypeForOrder == 0?false:true);

		var pGet = HttpService.templateAccessAPI( url, message );
		pGet.then( function( result ){
			$log.debug( 'get pre ship order list success', result );
			$scope.numRecords = result.total_count;
	    	$scope.orderList = result.order_list;
	    	$scope.numPages = Math.ceil( $scope.numRecords/$scope.pageSize.size );
		}, function( reason ){
			$log.debug( 'get pre ship order list failed', reason );
		})
	};

	$scope.setOrderListFlag = function(listType){
		$scope.listTypeForOrder = listType;
		$scope.currentPage = 1;
		$scope.getPreShipOrderList();
	}

    $scope.delivery = function( orderObj ){
	    var modalInstance = $uibModal.open({
	    	size: 'md',
			controller: 'DeliveryController',
			templateUrl: '../pier_merchant/view/delivery.html',
			backdrop: 'static',
			resolve:{
                orderObj: function(){
                	return orderObj
                }
            }
	    })
	    modalInstance.result.then(function(){
	    	$scope.getPreShipOrderList( 0 );
	    })
    };

    $scope.getOrderDetail = function( order ){
		var modalInstance = $uibModal.open({
	    	size: 'lg',
			controller: 'OrderDetailController',
			templateUrl: '../pier_merchant/view/order-detail.html',
			backdrop: 'static',
			resolve:{
                orderObj: function(){
                	return order
                }
            }
	    })
	    modalInstance.result.then(function(){
	    	
	    }, function(){
	    	$scope.getPreShipOrderList();
	    })
    }

	$scope.setOrderListFlag( 0 );
})
.controller( 'OrderDetailController', function( $scope, $log,  $uibModalInstance,  orderObj ){
	$scope.orderObj = orderObj;
	$scope.close = function(){
		$uibModalInstance.close();
	};
	$scope.dismiss = function(){
		$uibModalInstance.dismiss();
	};
} )
.controller( 'OrderDetail2Controller', function( $scope, $log, PierUtil, HttpService, ApiUrl, $uibModal ){
	$scope.trackingList = [];
	$scope.orderCanBeCancel = false;
	$scope.getOrderDetail = function(){
		var url = ApiUrl.orderDetail;
		var message = {
			order_id: $scope.orderObj.order_id,
		};
		$scope.orderStatus = '';
		var pGet = HttpService.templateAccessAPI( url, message );
		pGet.then(function( result ){
            $log.debug( 'get order detail success', result );
            $scope.createdOn = result.created_on;
            $scope.fee = result.fee;
            $scope.grandTotal = result.grand_total;
            $scope.logisticId = result.logistics_id;
            $scope.monthCharge = result.month_charge;
            $scope.monthPay = result.month_pay;
            $scope.orderId = result.order_id;
            $scope.payType = result.pay_type == 2?'是':'否';
            //1:active;2:是否支付;3:是否发货; 4是否砍单
            if( PierUtil.getBinBit( result.order_status, 2 ) != '1' ){
				$scope.orderStatus = '未支付';
            }else{
            	$scope.orderStatus = '已支付';
            }
            if( PierUtil.getBinBit( result.order_status, 3 ) != '1' ){
				$scope.orderStatus += ' | 未发货';
            }else{
				$scope.orderStatus += ' | 已发货';
            }
            if( PierUtil.getBinBit( result.order_status, 4 ) == '1' ){
				$scope.orderStatus += ' | 已取消订单';
            }
            $scope.orderCanBeCancel = false;
            if( PierUtil.getBinBit( result.order_status, 2 ) == '1' && PierUtil.getBinBit( result.order_status, 3 ) != '1' && PierUtil.getBinBit( result.order_status, 4 ) != '1' ){
            	$scope.orderCanBeCancel = true;
            }
            $scope.address = {
            	detail: result.receiver_address,
            	name: result.receiver_name,
            	phone: result.receiver_phone,
            }
            $scope.userPhone = result.phone;
            $scope.shippingCreatedOn = result.shipping_created_on;
            $scope.subTotal = result.sub_total;
            $scope.termCount = result.term_count;
            angular.forEach( result.items, function( value, key ){
            	result.items[key].logo = decodeURIComponent(value.logo);
            })
            $scope.productList = result.items;
            $scope.termId = result.term_id;
            $scope.shippingCompanyId = result.shipping_company_id;
            if( result.tracking_api_url !== '' ){
            	$scope.getLogisticInfo( result.tracking_api_url );
            }
		}, function( reason ){
			$log.debug( 'get Order detail failed', reason );
		})
	}

	$scope.getLogisticInfo = function( logisticUrl ){
		var url = ApiUrl.orderLogistic+'?url='+encodeURIComponent(logisticUrl);
		var message = {};
		var pGetLogis = HttpService.templateAccessAPI( url, message );
		pGetLogis.then(function( result ){
			$log.debug( 'get logistic success', result );
		}, function( reason ){
			$log.debug( 'get logistic failed', reason );
			if( reason.code == '0' ){
				$scope.trackingList = reason.data;
			}
		})
	};


	$scope.cancelOrder = function(){
		var modalInstance = $uibModal.open({
	    	size: 'sm',
			controller: 'OrderCancelController',
			templateUrl: '../pier_merchant/view/order-cancel.html',
			backdrop: 'static',
			resolve:{
                orderObj: function(){
                	return $scope.orderObj
                }
            }
	    })
	    modalInstance.result.then(function(){
	    	$scope.getOrderDetail()
	    	
	    }, function(){
	    	
	    })
	}
	$scope.getOrderDetail();
	
	
} )
.controller( 'OrderCancelController', function( $scope, $log,  $uibModalInstance,  orderObj, ApiUrl, HttpService ){
	$scope.orderObj = orderObj;

	$scope.close = function(){
		$uibModalInstance.close();
	};
	$scope.dismiss = function(){
		$uibModalInstance.dismiss();
	};
	$scope.getTemplates = function(){
		var url = ApiUrl.cancelOrderTemp;
		var message = {};
		var pGet = HttpService.templateAccessAPI( url, message );
		pGet.then(function( result ){
			$log.debug( 'get Templates success', result );
			$scope.tempateList = result.template_list;
			$scope.currentTemp = $scope.tempateList[0];
		}, function( reason ){
			$log.debug( 'get Template failed', reason );
		})
	};

	$scope.cancel = function(){
		var url = ApiUrl.cancelOrder;
		var message = {
			order_id: $scope.orderObj.order_id,
			message_template_id: $scope.currentTemp.id
		}
		var pCancel = HttpService.templateAccessAPI( url, message );
		pCancel.then( function( result ){
			$log.debug('order cancel success', result );
			$scope.close();
		}, function( reason ){
			$log.debug('order cancel success', reason );
			$scope.errorMsg = reason.message;
		})
	}

	$scope.getTemplates();
})
.controller( 'DeliveryController', function( $scope, $log,  $uibModalInstance,  orderObj ){

	$scope.orderObj = orderObj;

	$scope.close = function(){
		$uibModalInstance.close();
	};
	$scope.dismiss = function(){
		$uibModalInstance.dismiss();
	};
})
.controller( 'Delivery2Controller', function( $scope, $log, PierUtil, HttpService, ApiUrl ){
	$scope.shippingCompanies = [];
	$scope.getLogisticCompany = function(){
		var url = ApiUrl.shippingCompanyList;
		var message = {};
		var pGet = HttpService.templateAccessAPI( url, message );
		pGet.then( function( result ){
			$log.debug( 'get logistic company success', result );
			$scope.shippingCompanies = result.shipping_company;
			if( angular.isArray( $scope.shippingCompanies ) ){
				$scope.selectedLogistic = $scope.shippingCompanies[0];
			}
		}, function( reason ){
			$log.debug( 'get logistic company failed', reason );
		})
	};

	$scope.saveLogistic = function(){
		if( $scope.logisticId == '' || $scope.logisticId == undefined ){
			$scope.errorMsg = '物流订单号不能为空';
			return;
		}
		var url = ApiUrl.saveLogisticsId;
		var message = {
			order_id: $scope.orderObj.order_id,
			shipping_company_id: $scope.selectedLogistic.id,
			logistics_id: $scope.logisticId
		};
		var pSave = HttpService.templateAccessAPI( url, message );
		pSave.then( function( result ){
			$log.debug( 'save logistic success', result );
			$scope.close();
		}, function( reason ){
			$log.debug( 'save logistic failed', reason );
		})
	}
	$scope.getLogisticCompany();

})
// .controller( 'ShowLogisticController', function( $scope, $log,  $uibModalInstance,  orderObj ){

// 	$scope.orderObj = orderObj;

// 	$scope.close = function(){
// 		$uibModalInstance.close();
// 	};
// 	$scope.dismiss = function(){
// 		$uibModalInstance.dismiss();
// 	};
// })
// .controller( 'ShowLogistic2Controller', function( $scope, $log, PierUtil, HttpService, ApiUrl, $timeout ){

// 	$scope.getOrderDetail = function(){
// 		$log.debug( '$scope.orderObj',  $scope.orderObj );
// 		var url = ApiUrl.orderDetail;
// 		var message = {
// 			order_id: $scope.orderObj.order_id
// 		};
// 		var pGet = HttpService.templateAccessAPI( url, message );
// 		pGet.then( function( result ){
// 			$log.debug( 'get order detail success', result );
// 			$scope.logisticsId = result.logistics_id;
// 			$scope.monthCharge = result.month_charge;
// 			$scope.monthPay = result.month_pay;
// 			$scope.receiverAddress = result.receiver_address;
// 			$scope.receiverName = result.receiver_name;
// 			$scope.receiverPhone = result.receiver_phone;
// 			$scope.shippingCompanyId = result.shipping_company_id;
// 			$scope.shippingCreatedOn = result.shipping_created_on;
// 			$scope.subTotal = result.sub_total;
// 			$scope.termCount = result.term_count;
// 			$scope.term_id = result.term_id;
// 			$scope.fee = result.fee;
// 			$scope.grandTotal = result.grand_total;
// 			$scope.createdOn = result.created_on;
// 			$scope.getLogistic();
// 		}, function( reason ){
// 			$log.debug( 'get order detail failed', reason );
// 		})
// 	};

// 	$scope.getLogistic = function(){
// 		if( $scope.shippingCompanyId == '' || $scope.logisticsId=='' ){
// 			// $timeout( $scope.getLogistic(), 1000 );
// 			return;
// 		}
// 		var url = ApiUrl.trackingInfo;
// 		var message = {
// 			shipping_company_id: $scope.shippingCompanyId,
// 			logistics_id: $scope.logisticsId
// 		};
// 		var pGet = HttpService.templateAccessAPI( url, message );
// 		pGet.then( function( result ){
// 			$log.debug( 'get logistic success', result );
// 			$scope.trackingList = result.tracking_list;
// 		}, function( reason ){
// 			$log.debug( 'get logistic failed', reason );
// 		})
// 	}

// 	$scope.getOrderDetail();
// })
.controller( 'OrderSearchController', function(  $http, $scope, $log, ApiUrl, PierUtil, HttpService, $uibModal  ){
  // date widgets
    $scope.calender = {
	    error: false,
	    errorMsg: '',
	    opened: {
	      startDate: false,
	      endDate: false
	    },
	    dateFormat: 'MM/dd/yyyy',
	    dateOptions: {
	      formatYear: 'yy',
	      startingDay: 1
	    },
	    open: function($event, which) {
	      $event.preventDefault();
	      $event.stopPropagation();
	      for ( k in $scope.calender.opened ) {
	        if ( $scope.calender.opened.hasOwnProperty( k ) ) {
	          if ( k == which ) {
	            $scope.calender.opened[k] = true;
	          } else {
	            $scope.calender.opened[k] = false;
	          }
	        }
	      }
	    },
	    today: function() { 
	      $scope.calender.startDate =  new Date();
	      $scope.calender.endDate =  new Date();
	    }
    };
    // date config
    var endDate =  new Date();
    var startDate = new Date();
    var nowMonth = endDate.getMonth();
    startDate.setMonth( nowMonth -1 );
    startDate = PierUtil.date2string( startDate );
    endDate = PierUtil.date2string( endDate );

    $scope.startDate = startDate;
    $scope.endDate = endDate;
    $scope.maxDate = endDate;

    //pagnation config
    $scope.numRecords = 0;
    $scope.pageSizeOptions = [ { size: 10 }, { size: 20 }, { size: 30 } ];
    $scope.pageSize = $scope.pageSizeOptions[0];
    $scope.currentPage = 1;
    $scope.numPages = 1;

    $scope.$watch( 'startDate', function( newVal, oldVal, scope ){
        if( angular.isObject(newVal) ){
        	$scope.startDate = PierUtil.date2string( newVal );
        }
    } );

    $scope.$watch( 'endDate', function( newVal, oldVal, scope ){
        if( angular.isObject(newVal) ){
        	$scope.endDate = PierUtil.date2string( newVal );
        }
    } )

    //for fetch data in pagination
    $scope.$watch( 'currentPage', function( newVal, oldVal, scope){
        if( newVal!=oldVal ){
        	if( newVal > $scope.numPages ){
        		$scope.currentPage = $scope.numPages;
        	}
	        $scope.getOrderList();
        }
    } )
    $scope.$watch( 'pageSize', function( newVal, oldVal, scope){
        if( newVal!=oldVal ){
            $scope.currentPage = 1;
            $scope.getOrderList();
        }
    } )
    $scope.previousPage = function(){
	    if( $scope.currentPage > 1 ) $scope.currentPage -= 1;
    }
    $scope.nextPage = function(){
	    if( $scope.currentPage < $scope.numPages ) $scope.currentPage += 1;
    }

    $scope.getOrderList = function(){
    	var url = ApiUrl.searchOrder;
    	$log.debug( '$scope.startDate', $scope.startDate ); 
    	var message = {
             order_id: $scope.orderId,
             from: $scope.startDate,
             to: $scope.endDate,
             phone: $scope.phone
    	};
    	var pGet = HttpService.templateAccessAPI( url, message );
    	pGet.then( function( result ){
    		$log.debug( 'search order list success', result );
    		if( angular.isArray(result.order_list) ){
	     		angular.forEach( result.order_list, function( value, key ){
	     			$log.debug( 'value.order_status', value.order_status )
	    			result.order_list[key].shipped = false;
	    			if( PierUtil.getBinBit( value.order_status, 3 ) == '1' ){
	    				result.order_list[key].shipped = true;
	    			}
	    		} )   			
    		}

    		$scope.orderList = result.order_list;

    	}, function( reason ){
    		$log.debug( 'search order list failed', reason );

    	})
    };

    $scope.delivery = function( orderObj ){
	    var modalInstance = $uibModal.open({
	    	size: 'md',
			controller: 'DeliveryController',
			templateUrl: '../pier_merchant/view/delivery.html',
			backdrop: 'static',
			resolve:{
                orderObj: function(){
                	return orderObj
                }
            }
	    })
	    modalInstance.result.then(function(){
	    	$scope.getOrderList();
	    })
    };

   //  $scope.showLogistic = function( orderObj ){
	  //   var modalInstance = $uibModal.open({
	  //   	size: 'md',
			// controller: 'ShowLogisticController',
			// templateUrl: '../pier_merchant/view/show-logistic.html',
			// backdrop: 'static',
			// resolve:{
   //              orderObj: function(){
   //              	return orderObj
   //              }
   //          }
	  //   })
	  //   modalInstance.result.then(function(){
	  //   	$scope.getOrderList();
	  //   })
   //  };
    $scope.getOrderDetail = function( order ){
		var modalInstance = $uibModal.open({
	    	size: 'lg',
			controller: 'OrderDetailController',
			templateUrl: '../pier_merchant/view/order-detail.html',
			backdrop: 'static',
			resolve:{
                orderObj: function(){
                	return order
                }
            }
	    })
	    modalInstance.result.then(function(){
	    	
	    })
    }
})