const express=require('express')


const app = express()
const PORT=8082;
const request=require('request')

let CLIENT_ID='24443093752-l4m9is96jp05qkq1r602tapfb5jq577n.apps.googleusercontent.com'


app.get('/login', (req, resp) => {
   resp.redirect(302,
   // authorization endpoint
   'https://accounts.google.com/o/oauth2/v2/auth?'
   
   // client id
   + 'client_id='+ CLIENT_ID +'&'
   
   // scope "openid email"
   + 'scope=openid%20email&'
   
   // parameter state should bind the user's session to a request/response
   + 'state=some-id-based-on-user-session&'
   
   // responde_type for "authorization code grant"
   + 'response_type=code&'
   
   // redirect uri used to register RP
   + 'redirect_uri=http://localhost:8082/user/login')
})

app.get('/',function(req,res){
   res.end('Hello Captain,\n navigate to /login to start...')
})


 app.get('/user/login',function(req,res){

 })
 
 var server = app.listen(PORT, function () {
    var host = server.address().address
    var port = server.address().port
    console.log(`ready captain on port ${PORT}`)
 })