var app = require( 'express' ),
router = app.Router();
var http = require( 'http' );
var request = require( 'request' );

var apiUrl = require( '../config/apiUrl' );
var pierUtil = require( '../pierutil/util' );
var pierLog = require( '../pierlog' );


var urlPath, chunks;
var accessObj = undefined;

router.use('/', function(req, res, next) {
  urlPath = (req.path).split( '/' )[1];
  accessObj = apiUrl[pierUtil.getUrlPath( urlPath )];
  if( accessObj !== undefined ){
    var options = {
      url: apiUrl.hostName + accessObj.url,
      method: accessObj.method || "POST",
      json:true,
      body:req.body || {},
      headers: {
        'Content-Type': 'application/json'
      }
    };
    console.log( 'send api call options', options );
    request( options, function( err, response, body ){
      console.log( "get response body", body );
      res.send( body );
    })
    .on( 'error', function( e ){
      console.log( e.message );
    })
  }
} )
module.exports = router;