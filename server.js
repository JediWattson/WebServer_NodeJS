'use strict'

const
	conn = require("./server_obj/mysql-conn")(),
    bodyParser = require("body-parser"),
	path = require('path'),
	fs = require("fs"),
	express = require("express"),
	tls = require("tls"),
	https = require("https")
	
/**
	this is the start of the http angle of the server paragon, it's run with express and uses several post functions to
	handle user management.

var options = { 
	key: 	fs.readFileSync('/etc/letsencrypt/live/famtrees.ml/privkey.pem'), 
    cert: 	fs.readFileSync('/etc/letsencrypt/live/famtrees.ml/cert.pem'), 
};
var credentials = tls.createSecureContext(options);

*/

/*=============web(http)==============*/

var blogU = userTable('userBlog')
var app = express()
app.use(bodyParser.json())
app.use('/scripts',  express.static(__dirname))
app.get('/', (req, res) => {
 	res.sendFile(path.join(__dirname + '/index.html'))
})

app.post('/fbLogin', (req, res) => {
    var uID = req.body.fID
    if (uID != undefined){
		blogU.byFID(uID).then((result) => {
			if (result == undefined){
				res.send("addFBUser")
			}
			else{
				res.send("blog")
			}
		}).catch((err) => {throw err})
    }
})

app.post('/ipLog', (req, res) =>{
    console.log(Date()+" connected: " + req.connection.remoteAddress.split(':')[3])
})

app.post('/login', (req, res) => {
    var h = req.body.handle
    if (h != undefined){
	blogU.byHandle(h).then((result) => {
        if (result == undefined){
			res.send("Handle/Password combonation does not work!")
		}
		else{
			//console.log(result.attributes.init)			
			res.send("blog")
		}
        }).catch((err) => {throw err})
    }
    else{res.send("Please put something at least!!!")}
})

app.post('/addFBUser', (req, res) => {
	var insert = {handle : req.body.handle, fbid : req.body.fID}
	if(req.body.handle != ""){
		blogU.byHandle(insert.handle).then((result) => {
		    if (result == undefined){
				blogU.initUser(insert).then((u) =>{
					//TODO add a success page and logic
					res.send("Success!")
				}).catch((err) => {throw err})
			}
			else{res.send("User handle already exists, try again")}
		}).catch((err) => {throw err})
	}else{res.send("You need to enter something!!!")}
})

app.get('/addFBUser', (req, res) => {	
    res.sendFile(path.join(__dirname + '/addFBU.html'))
})

app.post('/addUser', (req, res) => {
	var insert = {handle : req.body.handle}
	if(req.body.handle != ""){
		blogU.byHandle(insert.handle).then((result) => {
		    if (result == undefined){
				blogU.initUser(insert).then((u) =>{
					//TODO add a success page and logic
					res.send("Success!")
				}).catch((err) => {throw err})
			}
			else{res.send("User handle already exists, try again")}
		}).catch((err) => {throw err})
	}else{res.send("You need to enter something!!!")}
})

app.get('/addUser', (req, res) => {	
    res.sendFile(path.join(__dirname + '/addU.html'))
})

app.post('/blog', (req, res)=> {
	res.sendFile(path.join(__dirname + '/blog.html'))	
})

app.post('/addBlog', (req, res)=>{
	var blog = {handle: req.body.handle, txtBlock: req.body.blog}
	
	
})

app.listen(80)


