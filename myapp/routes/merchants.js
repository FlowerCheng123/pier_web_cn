var express = require('express');
var router = express.Router();
var http = require( 'http' );
var request = require( 'request' );
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


var apiUrl = require( '../config/merchantApiUrl' );
var pierUtil = require( '../pierutil/util' );
var pierLog = require( '../pierlog' );



var CONSTANT = {
	_TITLE: '品而信用'
},
merchantStatus = true;

router.get('/doc', function(req, res, next) {
    res.render( 'doc/docs', {
	  	location:'doc',
	    title: CONSTANT._TITLE,
	    merchantStatus: merchantStatus,
	    accountName: pierUtil.getAccountName( req )
	});
});

router.get('/emailVerify', function(req, res, next){
	var _email = req.query.email || '';
	if( _email == '' ){
		res.redirect('/merchants/register');
		return;
	}
	res.render( 'auth/email-verify', {
	  	location:'register',
	    title: CONSTANT._TITLE,
	    merchantStatus: merchantStatus,
	    email: _email,
	    accountName: pierUtil.getAccountName( req )
	});
});

router.get('/login', function(req, res, next){
	var accountName = pierUtil.getAccountName( req );
	if( accountName != '' ){
		res.redirect('/merchants/dashboard');
		return;
	}
	res.render( 'auth/login', {
	  	location:'login',
	    title: CONSTANT._TITLE,
	    merchantStatus: merchantStatus,
	    accountName: pierUtil.getAccountName( req )
	});
});
router.get('/logout', function(req, res, next){
	var urlPath = 'logout';
	var _message = {}; 
	var _pierMerchant = req.session['pier_merchant'] || {};
	if( _pierMerchant == {} ){
		res.redirect('/merchants/login');
		return;
	}
    _message.merchant_id = _pierMerchant.merchant_id;
    _message.session_token = _pierMerchant.session_token;
	request( pierUtil.getRequestParams( urlPath, _message, true, true ) , function( err, response, body ){
        console.log( "get response body", body );
      	req.session['pier_merchant'] = {};
      	res.redirect('/merchants/login');
    })
    .on( 'error', function( e ){
        console.log( e.message );
    })
});
router.get('/register', function(req, res, next){
	res.render( 'auth/register', {
	  	location:'register',
	    title: CONSTANT._TITLE,
	    merchantStatus: merchantStatus,
	    accountName: pierUtil.getAccountName( req )
	});
});
router.get('/registerVerification', function(req, res, next){
	var _token = req.query.token;
	if( _token == '' || _token == undefined ){
		res.redirect( '/merchants/login' );
		return;
	}
	res.render( 'auth/register-verification', {
	  	location:'register',
	    title: CONSTANT._TITLE,
	    merchantStatus: merchantStatus,
	    token: _token,
	    accountName: pierUtil.getAccountName( req )
	});
});
router.get('/forgetPassword', function(req, res, next){
	res.render( 'auth/forget', {
	  	location:'forget',
	    title: CONSTANT._TITLE,
	    merchantStatus: merchantStatus
	});
});
router.get('/emailReset', function(req, res, next){
	var _email = req.query.email || '';
	if( _email == '' ){
		res.redirect('/merchants/login');
		return;
	}
	res.render( 'auth/email-reset', {
	  	location:'forget',
	    title: CONSTANT._TITLE,
	    merchantStatus: merchantStatus,
	    email: _email
	});
});

router.get('/resetVerification', function(req, res, next){
	var _token = req.query.token;
	if( _token == '' || _token == undefined ){
		res.redirect( '/merchants/login' );
		return;
	}
	res.render( 'auth/reset-verification', {
	  	location:'forget',
	    title: CONSTANT._TITLE,
	    merchantStatus: merchantStatus,
	    token: _token
	});
});

router.get('/resetSuccess', function(req, res, next){
	res.render( 'auth/reset-success', {
	  	location:'forget',
	    title: CONSTANT._TITLE,
	    merchantStatus: merchantStatus
	});
});

router.get('/dashboard', pierUtil.checkMerchantAuth, function(req, res, next){
	// console.log('dashboard path', req.path );
	res.render( 'dashboard/home',{
		location:'dashboard',
	    title: CONSTANT._TITLE,
	    merchantStatus: merchantStatus,
	    statusBit: req.session['pier_merchant'].status_bit,
	    accountName: req.session['pier_merchant'].email || ''
	})
});

router.post( '/getUserAuth', pierUtil.checkMerchantAuthForApi, function(req, res, next){
	var _result = { merchant_id:req.session['pier_merchant'].merchant_id, session_token:req.session['pier_merchant'].session_token };
	res.send({code:'200',message: 'ok',result: _result});
});
router.post( '/getStatusBit', pierUtil.checkMerchantAuthForApi, function(req, res, next){
	var _result = { status_bit: req.session['pier_merchant'].status_bit};
	res.send({code:'200',message: 'ok',result: _result});
});
router.post( '/getHostName', function(req, res, next){
	var _result = { hostname: apiUrl.hostName };
	res.send({code:'200',message: 'ok',result: _result});
});

router.post('/api/:id', function(req, res, next) {
    var urlPath = req.params.id;
    request( pierUtil.getRequestParams( urlPath, req.body, true ) , function( err, response, body ){
      console.log( "get response body api"+ pierUtil.getRequestParams( urlPath, req.body, true ).url, body );
      if( urlPath == 'login' && body.code == '200' ){
		req.session['pier_merchant'] = {
			status_bit: body.result.status_bit,
			merchant_id: body.result.merchant_id,
			session_token: body.result.session_token,
			email: req.body.email
		};
      }
      if( urlPath == 'register' && body.code == '200' ){
		req.session['pier_merchant'] = {
			status_bit: body.result.status_bit,
			merchant_id: body.result.merchant_id,
			session_token: body.result.session_token,
			email: req.body.email
		};
      }
      res.send( body );
    })
    .on( 'error', function( e ){
      console.log( e.message );
    })
} );

router.post('/authapi/:id', pierUtil.checkMerchantAuthForApi, function(req, res, next) {
    var urlPath = req.params.id;
    var _message = req.body;
    var _pierMerchant = req.session['pier_merchant'];
    _message.merchant_id = _pierMerchant.merchant_id;
    _message.session_token = _pierMerchant.session_token;
    request( pierUtil.getRequestParams( urlPath, _message, true, true ) , function( err, response, body ){
      console.log( "get response body api"+ pierUtil.getRequestParams( urlPath, _message, true, true ).url, body );
      if( body.code == '200' ){
      	if( body.result.session_token != undefined && body.result.session_token != '' ){
	      	pierUtil.refreshToken( req, body.result.session_token );
        }
        if( body.result.status_bit != undefined && body.result.status_bit != '' ){
	      	pierUtil.refreshStatusBit( req, body.result.status_bit );
        }
      }
      res.send( body );
    })
    .on( 'error', function( e ){
      console.log( e.message );
    })
} );

/**
 * 到物流详情页面
 * @id 订单的id,没有id直接跳转到首页
 */
router.post( '/orderLogistics', function( req, res, next ){
  var _logisticUrl = req.query.url;
  if( _logisticUrl == '' || _logisticUrl == undefined ){
    return;
  }
  var _url = decodeURIComponent( _logisticUrl );

  request({ 
    url:_url, 
    method: 'GET', 
    json:true,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      } 
    }, function( err, response, body ){
    res.send( body );    
  })
  .on( 'error', function( e ){
    console.log( e.message );
  });
});

module.exports = router;