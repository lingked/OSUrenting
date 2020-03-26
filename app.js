var express = require("express"),
	app = express({mergeParams: true}),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	methodOverride = require("method-override"),
	localStrategy = require("passport-local"),
	Apartment = require("./models/apartment"),
	Comment = require("./models/comment"),
	User = require("./models/user")

// require routes

var	commentRoutes = require("./routes/comments"),
	apartmentRoutes = require("./routes/apartments"),
	indexRoutes = require("./routes/index"),
	shareRoutes = require("./routes/shares")
	


mongoose.connect("mongodb+srv://lingkai:lingkai@ouschome-vopln.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true});
//MongoClient.connect({useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());



// PASSPORT CONFIGURATION

app.use(require("express-session")({
	secret: "No secret",
	resave: false,
	saveUninitialized: false
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
// SCHEMA SETUP

app.use(indexRoutes);
app.use(commentRoutes);
app.use("/apartments", apartmentRoutes);
app.use("/apartments", shareRoutes);



// PASSPORT CONFIGURATION



app.listen(process.env.PORT ||3000, function(){
	console.log("The Server Has Started!");
});

