var express = require('express');
var router = express.Router();
var path = require('path');
var pierLog = require( '../pierlog' );
var pierUtil = require( '../pierutil/util' );
var crypto = require('crypto');
var merchantStatus;


/* GET home page. */
router.get('/', function(req, res, next){
  pierLog.info('get home page');
  merchantStatus = false;
  res.render('home', { 
    location:'home',
    title: '品而信用',
    merchantStatus: merchantStatus
  });
  // res.sendFile(path.join(__dirname, '../pier_web_cn', 'index.html'));
  // res.sendFile('pier/index.html');
});
router.get('/Corporation', function(req, res, next){
  pierLog.info('get corporation page');
  merchantStatus = true;
  res.render('corporation', {
    location:'corporation',
    title: '品而信用',
    merchantStatus: merchantStatus,
    accountName: pierUtil.getAccountName( req )
  })
})
router.get('/about', function(req, res, next){
	pierLog.info('get about page');
	res.render('about',{
		location:'about',
    title: '品而信用',
		merchantStatus: merchantStatus,
    accountName: pierUtil.getAccountName( req )
	})
})
router.get('/joinus', function(req, res, next){
  pierLog.info('get about page');
  res.render('joinus',{
    location:'joinus',
    title: '品而信用',
    merchantStatus: merchantStatus,
    accountName: pierUtil.getAccountName( req )
  })
})
router.get('/corporation/checkout', function(req, res, next){
  pierLog.info('get checkout page');
  res.render('checkout',{
    location:'checkout',
    title: '品而信用',
    merchantStatus: merchantStatus,
    accountName: pierUtil.getAccountName( req )
  })
})
router.get('/secure', function(req, res, next){
  pierLog.info('get secure page');
  res.render('secure',{
    location:'secure',
    title: '品而信用',
    merchantStatus: merchantStatus,
  })
})
router.get('/faq', function(req, res, next){
  pierLog.info('get faq page');
  res.render('faq',{
    location:'faq',
    title: '品而信用',
    merchantStatus: merchantStatus,
    accountName: pierUtil.getAccountName( req )
  })
})
router.get('/shop', function(req, res, next){
  pierLog.info('get shop page');
  res.render('shop',{
    location:'shop',
    title: '品而信用',
    merchantStatus: merchantStatus,
    accountName: pierUtil.getAccountName( req )
  })
})
// router.get('/weixin/verification', function(req, res, next){
//   pierLog.info('receive weixin verification');
//   function sha1(str) {
//     console.log(str)
//     var md5sum = crypto.createHash('sha1');
//     md5sum.update(str,'utf8');
//     str = md5sum.digest('hex');
//     return str;
//   }

//   var _signature  = req.query.signature || '';
//   var _timestamp = req.query.timestamp|| '';
//   var _nonce = req.query.nonce|| '';
//   var _echostr = req.query.echostr|| '';
//   var _token = 'pierup83736242dwsfs43';
//   var tempArray = [ _token, _timestamp, _nonce ];
//   tempArray = tempArray.sort();
//   var tempStr = tempArray.join("");
//   var cryptResult = sha1(tempStr);
//   if( cryptResult == _signature ){
//     res.send(_echostr);
//   }else{
//     res.send(false);
//   }
// })
router.get('/liudan', function(req, res, next){
  pierLog.info('get liudan page');
  res.sendFile(path.join(__dirname, '../pier_web_cn', 'liudan.html'));
})

// router.get( '/demo/index.html', function( req, res, next ){
//   console.log('aaaaaaaaaaaaaaaaaa');
//   if( session['demoUser'] == undefined || session['demoUser'] == '' ){
//      res.render( 404 );
//   }

// })
module.exports = router;
