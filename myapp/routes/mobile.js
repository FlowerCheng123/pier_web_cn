var express = require('express');
var router = express.Router();
var path = require('path');
var pierLog = require( '../pierlog' );
var request = require( 'request' );
var pierUtil = require('../pierutil/util');
var apiUrl = require( '../config/apiUrl' );
var fs = require('fs');

/* GET home page. */
router.get('/features', function(req, res, next){
  pierLog.info('get features page');
  res.render('features', { title: '品而数据' });
});


router.post('/postGongjijin', function(req, res, next){
  pierLog.info('get Gongjijin page');
  var user_id = req.body.user_id || '';
  var session_token = req.body.session_token || '';
  if( user_id == '' || session_token == '' ) return;
  res.render('gongjijin', { session_token: session_token, user_id: user_id });
});
router.get('/getGongjijinValidImage', function(req, res, next){
  var urlPath = 'gongjijinValidImage';
  request( pierUtil.getRequestParams( urlPath ), function(err, response, body){
    res.send( body );
  } );
});
router.get('/gongjijinAddress', function(req, res, next){
  var urlPath = 'gongjijiAddress';
  console.log( 'get gongjijin address', pierUtil.getRequestParams( urlPath ) );
  request( pierUtil.getRequestParams( urlPath ), function(err, response, body){
    console.log( 'get gongjijin address response body', body );
    res.send( body );
  } );
});

router.post('/gongjijinValid', function(req, res, next){
  var urlPath = 'gongjijiValid';
  var message = req.body;
  request( pierUtil.getRequestParams( urlPath, message ), function(err, response, body){
    res.send( body );
  } );
});

router.post('/postzhengxin', function(req, res, next){
  pierLog.info('get zhengxing page');
  var user_id = req.body.user_id || '';
  var session_token = req.body.session_token || '';
  if( user_id == '' || session_token == '' ) return;
  res.render('zhengxin', { session_token: session_token, user_id: user_id });
});

router.get('/zhengXinPrepare', function(req, res, next){
  var urlPath = 'zhengXinPrepare';
  request( pierUtil.getRequestParams( urlPath ), function(err, response, body){
    var _date = body.result.date;
    var _image = body.result.imageUrl;
    res.send( {image_url: _image, date: _date} );
  } );
});

router.post('/zhengXinValid', function(req, res, next){
  var urlPath = 'zhengXinValid';
  var message = req.body;
  request( pierUtil.getRequestParams( urlPath, message ), function(err, response, body){
    res.send( body );
  } );
});

router.get('/sinaDataGetter', function(req, res, next){
  var code = req.query.code || '';
  if( code != '' ){
    res.render( 'sinaDateGetter', { code: code } );
  }else{
    next();
  }
});

router.get('/faq', function(req, res, next){
  pierLog.info('get faq page');
  res.render('faq', { title: '常见问题' });
});

router.get('/template', function(req, res, next){
  var _title = req.query.title || '';
  var _imageUrl = req.query.image_url || '';
  var _content = req.query.content || '';
  res.render( 'template', {
    title: _title,
    image_url: decodeURIComponent(_imageUrl),
    content: _content
  })

});


module.exports = router;