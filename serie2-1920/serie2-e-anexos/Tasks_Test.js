"use strict"

const express=require('express')
const app = express()
const PORT=8082;
const request=require('request')
const url = require('url')

const 
GOOGLE_CLIENT_ID='24443093752-l4m9is96jp05qkq1r602tapfb5jq577n.apps.googleusercontent.com',
GOOGLE_CLIENT_SECRET = '2LCS4rLIWGQTdtwCYbSmTfLi',
GITHUB_CLIENT_ID = '8c58a9745405de014b66',
GITHUB_CLIENT_SECRET = '57abb1941df3de65119a86df620288f69db2e921',
userToAuthenticate = 'A44857'
let code
let acess_token
let issuesArr

app.get('/login', (req, resp) => {
    resp.redirect(302,
       // authorization endpoint
       'https://accounts.google.com/o/oauth2/v2/auth?'
       
       // client id
       + 'client_id='+ GOOGLE_CLIENT_ID +'&'
       
       // scope "openid email"
       + `scope=https://www.googleapis.com/auth/tasks&`
       
       // parameter state should bind the user's session to a request/response
       + `state=${userToAuthenticate}&`
       
       // response_type for "authorization code grant"
       + 'response_type=code&'
       
       // redirect uri used to register RP
       + 'redirect_uri=http://localhost:8082/user/login')
    })

app.listen(PORT, () => 
console.log(`ready captain on port ${PORT}`)
)


 app.get('/user/login',(req,res)=>{

    
     code=url.parse(req.url,true).query.code

      request.post({
         url: 'https://oauth2.googleapis.com/token',
         form:{
         code:code,
         client_id:GOOGLE_CLIENT_ID,
         client_secret:GOOGLE_CLIENT_SECRET,
         redirect_uri:"http://localhost:8082/user/login",
         grant_type:"authorization_code"
         }
      }, (err, resp, body) => {
         acess_token = JSON.parse(body).access_token
      })


      /*let issue=issuesArr[req.query.nome]
      console.log(req.query.nome)
      console.log(issue.body)
      console.log(issue.author)*/
      let issueName="issue1"
    
         
            request.post({
               url:`https://www.googleapis.com/tasks/v1/users/@me/lists`,
               Authorization: "Bearer "+acess_token,
               form: {
                  "kind": "tasks#taskList",
                  "id": "1",
                  "etag": "tag",
                  "title": issueName,
                  "updated": new Date(),
                  "selfLink": "localhost:8082/tasks/1"
               }
         },(err,resp,body)=>{
               console.log('breakpoint 2')
            })
         
      })
