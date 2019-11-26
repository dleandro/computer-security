"use strict"

const express=require('express')
const app = express()
const PORT=8082;
const request=require('request')
const url = require('url')
const flatMap = require('array.prototype.flatmap')
let issuesArr=[]

const 
GOOGLE_CLIENT_ID='24443093752-l4m9is96jp05qkq1r602tapfb5jq577n.apps.googleusercontent.com',
GOOGLE_CLIENT_SECRET = '2LCS4rLIWGQTdtwCYbSmTfLi',
GITHUB_CLIENT_ID = '8c58a9745405de014b66',
GITHUB_CLIENT_SECRET = '57abb1941df3de65119a86df620288f69db2e921',
userToAuthenticate = 'A44857'
let form=`<html><body><form action="/tasks" method="get">Issues title:<br><input type="text" name="nome" value=""><input type="submit"></form></body></html>`
let googleCode = ""

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
      googleCode = req.query.code
      
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
   
   app.get('/issues/user/:repo', (req, res) => {
      request.get({
         headers: {
            'user-agent': 'node.js',
            'Content-Type': 'application/json',
            Authorization: `token ${req.query.token}`
         },
         url: `https://api.github.com/repos/${userToAuthenticate}/${req.param('repo')}/issues`
      }, (err, resp, body) => {
         let jsonObj = JSON.parse(body)
         res.setHeader('content-type', 'text/html')
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
      
   })
})

app.get('/tasks', (req,res) => {
   
   let token=""
   let info = req
   
   request.post({
      url: 'https://www.googleapis.com/oauth2/v4/token',
      form: {
         code: googleCode,
         client_id: GOOGLE_CLIENT_ID,
         client_secret: GOOGLE_CLIENT_SECRET,
         redirect_uri: 'http://localhost:8082/user/login',
         grant_type: "authorization_code"
      }
   }, (err, resp, body) => {
      token = JSON.parse(body).access_token
      
      getUserTaskLists(info, res, token)
   })
   
})


function getUserTaskLists(req, res, token) {

   let createdTaskListId
/*
   request.get({ 
      headers: {
      'user-agent': 'node.js',
      'Content-Type': 'application/json',
      Authorization:` Bearer ${token}`
   },
   url:`https://www.googleapis.com/tasks/v1/users/@me/lists/`
   
},(err, response, body) => {
   console.log('para aqui')
})*/
   
   request.get({
      headers: {
         'user-agent': 'node.js',
         'Content-Type': 'application/json',
         Authorization:` Bearer ${token}`
      },
      url:`https://www.googleapis.com/tasks/v1/users/@me/lists/a2VCS2JvQWhWNDlRS2p3WQ`
      
   },(err, response, body) => {
      
      if (JSON.parse(response.body).error.message == "Task list not found.") {
       
         request.post({
            url:`https://www.googleapis.com/tasks/v1/users/@me/lists`,
            headers: {
               'user-agent': 'node.js',
               'Content-Type': 'application/json',
               Authorization:` Bearer ${token}`
            },
             body:{ 
             kind: "tasks#taskList",
               etag: "tag",
               title: req.query.nome,
               updated: new Date(),
               selfLink: "localhost:8082/tasks/1"
             },
             json:true
         },(err, resp, body)=>{
            createdTaskListId = body.id
            console.log(body.toString())
      
        
         request.post({
            url:`https://www.googleapis.com/tasks/v1/lists/${createdTaskListId}/tasks`,
            headers: {
               'user-agent': 'node.js',
               'Content-Type': 'application/json',
               Authorization:` Bearer ${token}`
            },
            body:{
               kind: "tasks#task",
               id: "1",
               etag: "tag",
               title: "teste",
               updated: new Date(),
               selfLink: "localhost:8082/tasks/1",
               parent:"1",
               position: "1",
               notes: "this is a test",
               status: "completed",
               completed: new Date(),
               deleted: "False",
               hidden: "false",
              links:""
            },
            json:true
               
         
         }, (err, resp, body) => {
            res.send(body)
            let createdTaskId = body.id
            getTaskListTitle(createdTaskListId,createdTaskId,token)
         })
   })

   }
})
}

function getTaskListTitle(taskListId,taskId,access_token){
   request.get({
      headers: {
         'user-agent': 'node.js',
         'Content-Type': 'application/json',
         Authorization:` Bearer ${access_token}`
      },
      url:`https://www.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`
   }, (err, resp, body) => {
         console.log(JSON.parse(body).title)
   })
      
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
   }, (err, resp, body) => {
      
      let repos = flatMap(JSON.parse(body), e => '<a href=' + 'http://localhost:8082/issues/user/' + e.name + '?token=' + access_token + `> ${e.name}</a><br>`)
      res.setHeader('content-type', 'text/html');
      res.send(repos)
      
   })
   
}

app.listen(PORT, () => 
console.log(`ready captain on port ${PORT}`)
)