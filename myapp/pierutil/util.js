var apiUrl = require( '../config/apiUrl' );
var merchantApiUrl = require( '../config/merchantApiUrl' );

var pierUtil = {
	getUrlPath: function( url ){
        return url.split( '/' )[1];
	},
	getCurrentDate: function(){
       var myDate = new Date();
       var year = myDate.getFullYear().toString(),
       month = (myDate.getMonth()+1).toString(),
       day = myDate.getDate().toString();
       month = month.length==1?'0'+month:month;
       day = day.length==1?'0'+day:day;
       return year+month+day;
	},
  getRequestParams: function( urlPath, body, isMerchant, isAuth ){
    var _apiUrl = apiUrl;
    if( isMerchant ) _apiUrl = merchantApiUrl;
    var accessObj = isAuth? _apiUrl.auth[urlPath] : _apiUrl[urlPath];
    var options = {
      url: _apiUrl.hostName + accessObj.url,
      method: accessObj.method || "POST",
      json:true,
      body:body,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return options;
  },
  getRequestParams2: function( urlPath, body ){
    var accessObj = apiUrl[pierUtil.getUrlPath( urlPath )];
    var options = {
      url: apiUrl.hostName + accessObj.url,
      method: accessObj.method || "POST",
      json:true,
      body:body,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if( accessObj.method == 'GET' ){
      if( body.query ){
        for( var q in body.query ){
          options.url += '&'+q+'='+body.query[q]; 
        }
      }
    }
    return options;
  },
  checkMerchantAuthForApi: function( req, res, next ){
    var merchantAuth = req.session['pier_merchant'] || {};
    console.log( 'checkout Auth for merchant', merchantAuth );
    if( merchantAuth.merchant_id == undefined || merchantAuth.merchant_id == '' || merchantAuth.merchant_id == null ){
      res.send( { code: '401', message: '访问错误',result: {} } );
    }else{
      next();
    }
  },
  checkMerchantAuth: function( req, res, next ){
    console.log( 'ression', req.session);
    var merchantAuth = req.session['pier_merchant'] || {};
    console.log( 'checkout Auth for merchant', merchantAuth );
    if( merchantAuth.merchant_id == undefined || merchantAuth.merchant_id == '' || merchantAuth.merchant_id == null ){
      res.redirect( '/merchants/login' );
    }else{
      next();
    }
    // next();
  },
  refreshToken: function( req, token ){
    if( token == '' || token == undefined ) return;
    var merchantAuth = req.session['pier_merchant'] || {};
    if( merchantAuth.merchant_id == undefined || merchantAuth.merchant_id == '' || merchantAuth.merchant_id == null ){
      res.redirect( '/merchants/login' );
    }else{
      console.log('refresh token before:', req.session['pier_merchant'].session_token );
      req.session['pier_merchant'].session_token = token;
      console.log('refresh token later:', req.session['pier_merchant'].session_token );
    }
  },
  refreshStatusBit: function( req, statusBit ){
    if( statusBit == '' || statusBit == undefined ) return;
    var merchantAuth = req.session['pier_merchant'] || {};
    if( merchantAuth.merchant_id == undefined || merchantAuth.merchant_id == '' || merchantAuth.merchant_id == null ){
      res.redirect( '/merchants/login' );
    }else{
      console.log('refresh status bit before:', req.session['pier_merchant'].status_bit );
      req.session['pier_merchant'].status_bit = statusBit;
      console.log('refresh status bit later:', req.session['pier_merchant'].status_bit );
    }
  },
  getAccountName: function( req ){
    var _name = '';
    if( req.session['pier_merchant'] == undefined ||  req.session['pier_merchant'] == '' ) req.session['pier_merchant'] = {};
    if( req.session['pier_merchant'].email == undefined ||  req.session['pier_merchant'].email == '' ) _name = '';
    else _name = req.session['pier_merchant'].email;
    return _name;
  }
}

module.exports = pierUtil;