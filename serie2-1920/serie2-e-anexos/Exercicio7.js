const express=require('express')

const app = express()
const PORT=8082;
const request=require('request')
const url = require('url')

const 
GOOGLE_CLIENT_ID='24443093752-l4m9is96jp05qkq1r602tapfb5jq577n.apps.googleusercontent.com',
GITHUB_CLIENT_ID = '8c58a9745405de014b66',
GITHUB_CLIENT_SECRET = '57abb1941df3de65119a86df620288f69db2e921',
GITHUB_USER_EMAIL = 'A44868@alunos.isel.pt'


app.get('/login', (req, resp) => {
   resp.redirect(302,
      // authorization endpoint
      'https://accounts.google.com/o/oauth2/v2/auth?'
      
      // client id
      + 'client_id='+ GOOGLE_CLIENT_ID +'&'
      
      // scope "openid email"
      + `scope=openid%20email&`
      
      // parameter state should bind the user's session to a request/response
      + `state=${GITHUB_USER_EMAIL}&`
      
      // response_type for "authorization code grant"
      + 'response_type=code&'
      
      // redirect uri used to register RP
      + 'redirect_uri=http://localhost:8082/user/login')
   })
   
   app.get('/',function(req,res){
      res.end('Hello Captain,\n navigate to /login to start...')
   })
   
   app.get('/user/login', (req, res) => {
      
      res.redirect(302, url.format({
         protocol: 'https', 
         hostname: 'github.com', 
         pathname: 'login/oauth/authorize', 
         query: { 
            client_id: GITHUB_CLIENT_ID, 
         } 
      }))
   })
   
   app.get('/user/login/granted', (req, res) => {
      
      request.post({
         url: 'https://github.com/login/oauth/access_token',
         form: {
            headers: {
               'Content-Type': 'application/json'
            },
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code: req.query.code
            
         }
      }, (err, resp, body) => {
         listIssues(body, res)
      })
   })

   app.get('user/task', (req, res) => {

      request.post({
         url: `https://www.googleapis.com/tasks/v1/users/${GITHUB_USER_EMAIL}/lists`,
         form: {
               "kind": "tasks#taskList",
               "id": string,
               "etag": string,
               "title": string,
               "updated": datetime,
               "selfLink": string
         }
      }, (err, resp, body) => {


      })



   })
   
   function listIssues(token, res) {
      request.get({
         headers: {
            'user-agent': 'node.js',
            Authorization: `token ${token.split('&')[0].split('=')[1]}`
         },
         url: 'https://api.github.com/repos/dleandro/si2/issues'
      }, (err, resp, body) => {
         res.end(body.toString() )
      })
      
   }
   
   app.listen(PORT, () => 
   console.log(`ready captain on port ${PORT}`)
   )