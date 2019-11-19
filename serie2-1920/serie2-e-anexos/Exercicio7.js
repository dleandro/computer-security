const express=require('express')

const app = express()
const PORT=8082;
const request=require('request')
const url = require('url')
const flatMap = require('array.prototype.flatmap')

const 
GOOGLE_CLIENT_ID='24443093752-l4m9is96jp05qkq1r602tapfb5jq577n.apps.googleusercontent.com',
GITHUB_CLIENT_ID = '8c58a9745405de014b66',
GITHUB_CLIENT_SECRET = '57abb1941df3de65119a86df620288f69db2e921',
userToAuthenticate = 'dleandro'


app.get('/login', (req, resp) => {
   resp.redirect(302,
      // authorization endpoint
      'https://accounts.google.com/o/oauth2/v2/auth?'
      
      // client id
      + 'client_id='+ GOOGLE_CLIENT_ID +'&'
      
      // scope "openid email"
      + `scope=openid%20email&`
      
      // parameter state should bind the user's session to a request/response
      + `state=${userToAuthenticate}&`
      
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
            login: req.query.state,
            scope: 'repo'
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
         listUserRepos(body, res)
      })
   })
   
   app.get('/user/task', (req, res) => {
      
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
   
   app.get('/issues/user/:repo', (req, res) => {
      request.get({
         headers: {
            'user-agent': 'node.js',
            'Content-Type': 'application/json'
         },
         url: `https://api.github.com/repos/${userToAuthenticate}/${req.param('repo')}/issues`
      }, (err, resp, body) => {
         res.send(JSON.stringify(body))
      })
   })
   
   function listUserRepos(token, res) {
      request.get({
         headers: {
            'user-agent': 'node.js',
            'Content-Type': 'application/json',
            Authorization: `token ${token.split('&')[0].split('=')[1]}`
         },
         url: 'https://api.github.com/user/repos'
      }, (err, resp, body) => {
    
         let repos = flatMap(JSON.parse(body), e => '<a href=' + 'http://localhost:8082/issues/user/' + e.name + `> ${e.name}</a><br>`)
         res.setHeader('content-type', 'text/html');
         res.send(repos)
         
      })
      
   }
   
   app.listen(PORT, () => 
   console.log(`ready captain on port ${PORT}`)
   )