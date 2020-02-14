

var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var Comment = require("../models/comment");


// root route
router.get("/", function(req, res){
	res.render("landing");
});


// ======================
// AUTH ROUTES
//=======================

// show register form
router.get("/register", function(req, res){
	res.render("register");
});
// handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/apartments");
		});
	});
});


// show login form
router.get("/login", function(req, res){
	res.render("login");
});
// handling login logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/apartments",
		failureRedirect: "/login"
	}), function(req, res){
	 w
});

// logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/apartments");
});



module.exports = router;