// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT
const createError = require('http-errors');

// Include the express module
const express = require('express');

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// Path module - provides utilities for working with file and directory paths.
const path = require('path');

// Helps in managing user sessions
const session = require('express-session');

// include the mysql module
var mysql = require('mysql');

// Bcrypt library for comparing password hashes
const bcrypt = require('bcryptjs');

// Include the express router. 
const utilities = require('./api/utilities');

const port = 9065;

// create an express application
const app = express();

app.use(bodyparser.urlencoded({extended: true}));  // help with parsing req body

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// required for reading XML files
const dbCon = mysql.createPool({
    connectionLimit: 100,
    host: "us-cdbr-east-03.cleardb.com",
    user: "b084717972b47a",               // replace with the database user provided to you
    password: "69f09248",                  // replace with the database password provided to you
    database: "heroku_ba8710f68fd386d",           // replace with the database user provided to you
    port: 3306
});
   

// Use express-session
// In-memory session is sufficient for this assignment
app.use(session({
        secret: "csci4131secretkey",
        saveUninitialized: true,
        resave: false
    }
));

// middle ware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || port,() => console.log('Listening...'));


    
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'public/welcome.html'));
    });
    

    // GET method route for the contacts page.
    // It serves contact.html present in public folder
    app.get('/contacts', function(req, res) {
    	if(!req.session.value){
	   	res.redirect(302, '/login');
   	} else {
        res.sendFile(path.join(__dirname, 'public/contacts.html'));
        }
    });

    app.get('/stock', function(req, res) {
    	 if(!req.session.value){
	   	res.redirect(302, '/login');
   	} else {
        res.sendFile(path.join(__dirname, 'public/stock.html'));
        }
    });

    app.get('/game', function(req, res) {
        if(!req.session.value){
          res.redirect(302, '/login');
      } else {
       res.sendFile(path.join(__dirname, 'public/Game.html'));
       }
   });

    app.get('/login', function(req, res) {
    	 if(req.session.value){
   	    res.redirect(302, '/contacts');
   	}
        res.sendFile(path.join(__dirname, 'public/login.html'));
    });
	var login;
    app.post('/loginReq', function(req, res){
        var loginInfo = req.body;
         login = loginInfo.login;
        var pwd = loginInfo.password;
        
            
            var run = ("SELECT * FROM tbl_accounts");
            dbCon.query(run, function(err, rows, fields) {
                if (err) {
                    throw err;
                }
            
                var check = false;
                for(var i = 0; i < rows.length; i++){	
                    var logIn = rows[i].acc_login;
                    var passIn = rows[i].acc_password;
                    var hold = bcrypt.compareSync(pwd, passIn); // compare passwords
                    if(hold && (logIn == login)) {
                        check = true;
                        break;
                    }
                }
            
                if(check) {
                    req.session.value = 1;
                    res.json({status: 'success'});
                } else {
                    res.json({status: 'fail'});
                }
            });
        });
    
    app.post('/ledgerAdd', function(req, res){
        alert("here in the ledger");

    });

    app.get('/getContacts', function(req, res){
            
        dbCon.query('SELECT * FROM tbl_contacts', function(err, rows, fields) {
            if (err) {
                throw err;
            }
            if(rows.length == 0) {
            	var msg = {"contacts": []};
            	res.send(msg);
            } else {
                    var contactsArray = [];
                    for (var i = 0; i < rows.length; i++) {
                        var obj = {};
                        obj['name'] = rows[i].name;
                        obj['category'] = rows[i].category;
                        obj['location'] = rows[i].location;
                        obj['contact'] = rows[i].contact_info;
                        obj['email'] = rows[i].email;
                        obj['website_url'] = rows[i].website_url;
                        obj['username'] = login;
                        
                        contactsArray.push(obj);
                    }
                    
                    var returnObj = {"contacts": contactsArray};
                    var responseMsg = {res:returnObj};
                    var responseMsg = JSON.stringify(responseMsg);
                    res.send(responseMsg);
                }
        });
    });

    app.get('/username', function(req,res){
        dbCon.query('SELECT * FROM tbl_accounts', function(err, results){
            if(err){
                throw err;
            }
            var obj = {};
            obj['name'] = results[0].acc_name;
            var responseMsg = {res:obj};
            var responseMsg = JSON.stringify(responseMsg);
            res.send(responseMsg);
        });
    });

    app.post('/updateContact', function(req, res) {
    	if(!req.session.value) {
            res.redirect(302, '/login');
        }
       else { 
                var sqlUpdate = 'UPDATE tbl_contacts SET category = \'' + [req.body.cat] + '\', location = \'' + [req.body.loc] + '\', contact_info = \'' 
                                 + [req.body.info] + '\', email = \'' + [req.body.email] + '\', website_url = \'' + [req.body.web] + '\' WHERE name = \'' 
                                 + [req.body.name] + '\'';
                  
                        
				dbCon.query(sqlUpdate, function(err, rows, fields) {
				        if (err) {
				            throw err;
				        }
				    var response_Msg = {flag: true};
				    res.send(response_Msg);
				});
           }  
    });


    app.post('/addContact', function(req, res) {
    
        if(!req.session.value) {
            res.redirect(302, '/login');
        }
        else {
            var username = req.body.name;
            var jObj = {};
                jObj['name'] = req.body.name;
                jObj['category'] = req.body.cat;
                jObj['location'] = req.body.loc;
                jObj['contact_info'] = req.body.info;
                jObj['email'] = req.body.email;
                jObj['website_url'] = req.body.web;
                
                dbCon.query('SELECT * FROM tbl_contacts WHERE name = ?', username, function(err, rows, fields) {
                        if (err) {
                            throw err;
                        }
                        
                  
                        if(rows.length == 0) {
				dbCon.query('INSERT tbl_contacts SET ?', jObj, function(err, rows, fields) {
				        if (err) {
				            throw err;
				        }
				    var response_Msg = {flag: true};
				    res.send(response_Msg);
				});
			} else {
				var response_Msg = {flag: false};
				    res.send(response_Msg);
			}
            });
           }
    });
    
    app.post('/deleteContact', function(req, res) {
		if(!req.session.value) {
		    res.redirect(302, '/login');
		}
		else {
		// need to check if username exist if not data.flag = true;
		    var username = req.body.name;     
		        dbCon.query('SELECT * FROM tbl_contacts WHERE name = ?', username, function(err, rows, fields) {
		                if (err) {
		                    throw err;
		                }
		           
		                if(rows.length == 1) {
					dbCon.query('DELETE  FROM tbl_contacts WHERE name = ?', username, function(err, rows, fields) {
						if (err) {
						    throw err;
						}
					    var response_Msg = {flag: true};
					    res.send(response_Msg);
					});
				} else {
					var response_Msg = {flag: false};
					    res.send(response_Msg);
				}
		    });
		   }
	    });

    app.get('/logout', function(req, res) {
        if(!req.session.value){
            res.redirect(302, '/login');
        } else {
            req.session.destroy();
            res.redirect(302, '/login');
            }
    });

    app.get('*', function(req, res) {
        res.sendStatus(404);
    });



// Makes Express use a router called utilities
app.use('/api', utilities);

// function to return the 404 message and error to client
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error');
    res.send();
});
