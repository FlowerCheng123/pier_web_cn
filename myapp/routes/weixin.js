var express = require('express');
var router = express.Router();
var path = require('path');
var pierLog = require( '../pierlog' );
var pierUtil = require( '../pierutil/util' );
var crypto = require('crypto');
var request = require( 'request' );

var wx = {
  config: {
    appID:'wxa042ffde24264c4a',
    secret: 'b4e36453aee7353c33a1ff684c05b061'
  },
  getAccessTokenUrl: function( APPID, SECRET, CODE ){
    var tempUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+APPID+'&secret='+SECRET+'&code='+CODE+'&grant_type=authorization_code';
    return tempUrl;
  },
  getUserInfoUrl: function( ACCESS_TOKEN, OPENID ){
    var tempUrl = 'https://api.weixin.qq.com/sns/userinfo?access_token='+ACCESS_TOKEN+'&openid='+OPENID+'&lang=zh_CN';
    return tempUrl;
  },
  getTicketUrl: function( ACCESS_TOKEN ){
    return 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+ACCESS_TOKEN+'&type=jsapi';
  }
};
//for test
// var wx = {
//   config:{
//     appID:'wx20836ca41cb4f528',
//     secret: '5dba34f0b9157fd7706b5fda03f3212c'
//   },
//   getAccessTokenUrl: function( APPID, SECRET, CODE ){
//     var tempUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+APPID+'&secret='+SECRET+'&code='+CODE+'&grant_type=authorization_code';
//     return tempUrl;
//   },
//   getUserInfoUrl: function( ACCESS_TOKEN, OPENID ){
//     var tempUrl = 'https://api.weixin.qq.com/sns/userinfo?access_token='+ACCESS_TOKEN+'&openid='+OPENID+'&lang=zh_CN';
//     return tempUrl;
//   }
// };

var Util = {
  newNoncestr: function( len ){
    len = len || 16;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var randomStr = '';
　　for (i = 0; i < len; i++) {
　　　　randomStr += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return randomStr;
  },
  getTimeStamp: function(){
    return Math.round(new Date().getTime()/1000);
  },
  sha1: function( str ){
    console.log(str)
    var md5sum = crypto.createHash('sha1');
    md5sum.update(str,'utf8');
    str = md5sum.digest('hex');
    return str;
  },
  getRequestParams: function( url, body, method ){
    var options = {
      url: url,
      method: method || "GET",
      json:true,
      body:body,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return options;
  }
}

var templateAccessApi = function( bodyObj, req, res, callback ){
  try{
    if( typeof bodyObj != 'object' ) return;
    var _url = bodyObj.url || '', 
    _message = bodyObj.message || '';
    request( Util.getRequestParams( _url, _message ) , function( err, response, body ){
      console.log( 'get weixin api'+ _url, body );
      callback.call( this, body )
    })
    .on( 'error', function( e ){
      console.log( e.message );
    })
  }catch(e){
    console.error("Error", e );
  }
};

var getUserInfo = function( req, res, accessToken, openId ){
  var bodyObj = {
    url: wx.getUserInfoUrl( accessToken, openId ),
    message: {}
  };
  var getInfo = templateAccessApi( bodyObj, req, res, function(result){
      console.log( 'wei xin get user  info success', result );
      req.session['weixinUser'].userInfo = result;
  });
}


/* GET home page. */
router.get('/', function(req, res, next){
  pierLog.info('get home page');
  merchantStatus = false;
  res.render('home', { 
    location:'home',
    title: '品而信用',
    merchantStatus: merchantStatus
  });
});

router.get('/verification', function(req, res, next){
  pierLog.info('receive weixin verification');

  var _code = req.query.code || '';
  var _state = req.query.state || '';

  if( _code !== '' ){
     res.redirect( '/weixin/home?code='+_code );
  }else{
    var _signature  = req.query.signature || '';
    var _timestamp = req.query.timestamp|| '';
    var _nonce = req.query.nonce|| '';
    var _echostr = req.query.echostr|| '';
    var _token = 'pierup83736242dwsfs43';
    var tempArray = [ _token, _timestamp, _nonce ];
    tempArray = tempArray.sort();
    var tempStr = tempArray.join("");
    var cryptResult = sha1(tempStr);
    if( cryptResult == _signature ){
      res.send(_echostr);
    }else{
      res.send(false);
    }    
  }
});

router.get('/home', function(req, res, next){

    var _code = req.query.code || '';
    if( _code === '' ){
      res.render( 'home');
      return;
    }else{
      var bodyObj = {
        url: wx.getAccessTokenUrl( wx.config.appID, wx.config.secret, _code ),
        message: {}
      };
      var getAccessToken = templateAccessApi( bodyObj, req, res, function(result){
          console.log( 'get accessToken success', result );
          req.session['weixinUser'] = {
            access_token: result.access_token,
            open_id: result.openid
          };
          var bodyObj = {
            url: wx.getUserInfoUrl( accessToken, openId ),
            message: {}
          };
          var getInfo = templateAccessApi( bodyObj, req, res, function(result){
              console.log( 'wei xin get user  info success', result );
              req.session['weixinUser'].userInfo = result;
              console.log( "req.session[weixinUser]", req.session['weixinUser'] );
              res.render( 'home', req.session['weixinUser'].userInfo );
          });
      });      
    }
});

module.exports = router;


        //获取使用js-sdk的凭证
        // var bodyObj = {
        //   url: wx.getTicketUrl( result.access_token ),
        //   message: {}
        // };
        // var getTicket = templateAccessApi( bodyObj, req, res, function( result ){
        //   req.session['weixinUser'].ticket = result.ticket;
        //   var echostr = Util.newNoncestr();
        //   var jsapi_ticket = result.ticket;
        //   var timestamp = Util.getTimeStamp();
        //   var url = 'http://'+ req.hostname+req.originalUrl;

        //   var signStr = 'jsapi_ticket='+jsapi_ticket+'&noncestr='+echostr+'&timestamp='+timestamp+'&url='+url;
        //   var signature = Util.sha1(signStr);
        //   var apiList = ['onMenuShareTimeline','getLocation', 'chooseImage'];

        //   res.render( 'home', { timestamp: timestamp, apiId: wx.config.appID, nonceStr:echostr, signature: signature, apiList: apiList } );
        // })
