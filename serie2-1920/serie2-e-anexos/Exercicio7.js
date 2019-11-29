"use strict"

const express=require('express')
const app = express()
const PORT=8082;
const url = require('url')
const flatMap = require('array.prototype.flatmap')
const request = require('./apis-data')

// secret to avoid requests from third parties being replicated
const secretState="thisisasecretcode"

const 
GOOGLE_CLIENT_ID='24443093752-l4m9is96jp05qkq1r602tapfb5jq577n.apps.googleusercontent.com',
GOOGLE_CLIENT_SECRET = '2LCS4rLIWGQTdtwCYbSmTfLi',
GITHUB_CLIENT_ID = '8c58a9745405de014b66',
GITHUB_CLIENT_SECRET = '57abb1941df3de65119a86df620288f69db2e921',
userToAuthenticate = 'dleandro'

let form=`<html><body><form action="/tasks" method="get">Issues title:<br><input type="text" name="nome" value=""><input type="submit"></form></body></html>`
let googleCode = ""
let githubAccessToken
let issuesArr={}


app.get('/',function(req,res){
   res.end('Hello Captain,\n navigate to /login to start...')
})


function setResponse(res, data) {
   res.send(data.toString())
}

// redirect for google authentication and consent
app.get('/login', (req, resp) => {
   resp.redirect(302,
      // authorization endpoint
      'https://accounts.google.com/o/oauth2/v2/auth?'
      
      // client id
      + 'client_id='+ GOOGLE_CLIENT_ID +'&'
      
      // scope "openid email"
      + `scope=openid%20email%20https://www.googleapis.com/auth/tasks&`
      
      + 'nonce=cewhcj&' 
      
      // parameter state should bind the user's session to a request/response
      + `state=${secretState}&`
      
      // response_type for "authorization code grant"
      + 'response_type=code&'
      
      // redirect uri used to register RP
      + 'redirect_uri=http://localhost:8082/user/login')
   })
   
   // redirect for github authentication and consent
   app.get('/user/login', (req, res) => {
      if(!req.query.state === secretState){
         res.write("Aborting Process...Third Party Request")
         res.end()
         return
      }

      // save google code to later on get access_token from google
      googleCode = req.query.code
      
      res.redirect(302, url.format({
         protocol: 'https', 
         hostname: 'github.com', 
         pathname: 'login/oauth/authorize', 
         query: { 
            client_id: GITHUB_CLIENT_ID, 
            login: userToAuthenticate,
            scope: 'repo',
            state:secretState
         } 
      }))
   })
   

   // try to get a github access_token so that we can access our authenticated user's github info
   app.get('/user/login/granted', (req, res) => {
      
      if(!req.query.state === secretState){
         res.write("Aborting Process...Third Party Request")
         res.end()
         return
      }

      request.post({
         url: 'https://github.com/login/oauth/access_token',
         form: {
            headers: {
               'Content-Type': ' application/json; charset=utf-8'
            },
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code: req.query.code
         }
      }, body => listUserRepos(body, res), error => setResponse(res, error))

      
   })
   
   // list issues from authenticated user's specific repo
   app.get('/issues/user/:repo', (req, res) => {
      
      request.get({
         headers: {
            'user-agent': 'node.js',
            'Content-Type': ' application/json; charset=utf-8',
            Authorization: `token ${githubAccessToken}`
         },
         url: `https://api.github.com/repos/${userToAuthenticate}/${req.params.repo}/issues`
      }, body => {
         let jsonObj = JSON.parse(body)
         res.setHeader('content-type', 'text/html; charset=utf-8')
         if (jsonObj.message == undefined) {
            jsonObj.forEach(element =>{ res.write("<p>Title: " + element.title + ', Body: ' + element.body + ', creator: ' +element.user.login + "<\p>")
            issuesArr[element.title]={
               body:element.body,
               author:element.user.login
            }
         })
         res.write(form)
         res.end()
      } else
      
      res.send("not found")
      
   }, error => setResponse(res, error))
})

// get google's access_token from google code previously retrieved and when access_token is in our posession 
// call function that handles user tasklists
app.get('/tasks', (req,res) => {
      
   request.post({
      url: 'https://www.googleapis.com/oauth2/v4/token',
      form: {
         code: googleCode,
         client_id: GOOGLE_CLIENT_ID,
         client_secret: GOOGLE_CLIENT_SECRET,
         redirect_uri: 'http://localhost:8082/user/login',
         grant_type: "authorization_code"
      }
   }, body => getUserTaskLists(req, res, JSON.parse(body).access_token), error => setResponse(res, error))
   
})


function getUserTaskLists(req, res, token) {
      
   request.post({
      url:`https://www.googleapis.com/tasks/v1/users/@me/lists`,
      headers: {
         'user-agent': 'node.js',
         'Content-Type': 'application/json',
         Authorization: ` Bearer ${token}`
      },
      body: { 
         kind: "tasks#taskList",
         etag: "tag",
         title: "TaskList",
         updated: new Date(),
         selfLink: "localhost:8082/tasks/1"
      },
      json: true
   }, body => createTask(res, req.query.nome, body.id, token), error => setResponse(res, error))
   
}

function createTask(res, futureTaskName, createdTaskListId, token) {

   request.post({
      url:`https://www.googleapis.com/tasks/v1/lists/${createdTaskListId}/tasks`,
      headers: {
         'user-agent': 'node.js',
         'Content-Type': 'application/json',
         Authorization: ` Bearer ${token}`
      },
      body: {
         kind: "tasks#task",
         id: "1",
         etag: "tag",
         title: futureTaskName,
         updated: new Date(),
         selfLink: "localhost:8082/tasks/1",
         parent:"1",
         position: "1",
         notes: issuesArr[futureTaskName].body,
         status: "needsAction",
         completed: new Date(),
         deleted: "False",
         hidden: "false",
         links:""
      },
      json: true
      
   }, body => {
      let task = {
         id: body.id,
         title: body.title,
         description: body.notes,
         author: body.author
      }
      res.send(task)
   }, error => setResponse(res, error))

}

function listUserRepos(token, res) {
   
   const access_token = token.split('&')[0].split('=')[1]
   
   request.get({
      headers: {
         'user-agent': 'node.js',
         'Content-Type': 'application/json',
         Authorization: `token ${access_token}`
      },
      url: 'https://api.github.com/user/repos'
   }, body => {
      githubAccessToken = access_token
      let repos = flatMap(JSON.parse(body), e => '<a href=' + 'http://localhost:8082/issues/user/' + e.name + `> ${e.name}</a><br>`)
      res.setHeader('content-type', 'text/html');
      res.send(repos)
      
   }, error => setResponse(res, error))
   
}

app.listen(PORT, () => 
console.log(`ready captain on port ${PORT}`)
)