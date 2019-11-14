const express=require('express')


const app = express()
const PORT=8082;
const request=require('request')

const 
GOOGLE_CLIENT_ID='24443093752-l4m9is96jp05qkq1r602tapfb5jq577n.apps.googleusercontent.com',
GITHUB_CLIENT_ID = '8c58a9745405de014b66',
GITHUB_CLIENT_SECRET = '57abb1941df3de65119a86df620288f69db2e921'


app.get('/login', (req, resp) => {
   resp.redirect(302,
      // authorization endpoint
      'https://accounts.google.com/o/oauth2/v2/auth?'
      
      // client id
      + 'client_id='+ GOOGLE_CLIENT_ID +'&'
      
      // scope "openid email"
      + 'scope=openid%20email&'
      
      // parameter state should bind the user's session to a request/response
      + 'state=some-id-based-on-user-session&'
      
      // response_type for "authorization code grant"
      + 'response_type=code&'
      
      // redirect uri used to register RP
      + 'redirect_uri=http://localhost:8082/user/login')
   })
   
   app.get('/',function(req,res){
      res.end('Hello Captain,\n navigate to /login to start...')
   })
   
   
   app.get('/user/login', function(req, res){
      let 
      inDanger = false,
      access_token
      
      
      request.get({
         headers: {'user-agent': 'node.js'},
         url: 'https://github.com/login/oauth/authorize',
         client_id: GITHUB_CLIENT_ID,
         redirect_uri: 'http://localhost:8082',
         login: 'A44857',
         state: 'random-secret',
         allow_signup: 'false'
      }, (err, resp, body) => {
         if (body.state != 'random-secret') {
            inDanger = true
            res.end('its a third party')
         }
      })
      
      if (inDanger) {
         return
      }

      request.post({
         headers: {'user-agent': 'node.js'},
         url: `https://github.com/login/oauth/access_token`,
         client_id: GITHUB_CLIENT_ID,
         client_secret: GITHUB_CLIENT_SECRET,
         redirect_uri: 'http://localhost:8082',
         state: 'random-secret'
         
      }, (err, resp, body) => {
         access_token = resp.access_token
      })
   
      request.get({
         headers: {'user-agent': 'node.js'},
         Authorization: access_token,
         url: 'https://api.github.com/user/issues'
      }, (err, resp, body) => {
         res.end(body.toString())
      })
   
   })
   
   var server = app.listen(PORT, function () {
      var host = server.address().address
      var port = server.address().port
      console.log(`ready captain on port ${PORT}`)
   })