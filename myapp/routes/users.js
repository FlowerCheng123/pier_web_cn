var express = require('express');
var router = express.Router();
var request = require( 'request' );
var pierUtil = require('../pierutil/util');
var pierLog = require( '../pierlog' );
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with user module');
});

router.post('/borrowerAgreements', function(req, res, next) {
	var params = req.body;
    res.render( 'protocal/agreements',params);
});


router.get('/forgetPassword', function(req, res, next) {
  res.render('mobile/resetPsd/forget-psd',{
    title:'忘记密码',
    location: 'forgetPassword'
  });
});
router.get('/resetPassword/:token', function(req, res, next) {
  console.log( 'reset password', req.params.token);
  res.render('mobile/resetPsd/reset-psd',{
    token:req.params.token,
    title:'忘记密码',
    location: 'forgetPassword'
  });
});
router.get('/resetSuccess', function(req, res, next) {
  res.render('mobile/resetPsd/reset-success',{title:'重置密码成功',location: 'forgetPassword'});
});


module.exports = router;