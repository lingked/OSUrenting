var express = require("express"),
	app = express({mergeParams: true}),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	methodOverride = require("method-override"),
	localStrategy = require("passport-local"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds")

// require routes

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index")
	


mongoose.connect("mongodb+srv://lingkai:lingkai@ouschome-vopln.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true});
//MongoClient.connect({useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));

//console.log(__dirname+"/public");
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB(); //seed the database




// PASSPORT CONFIGURATION

app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
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
app.use("/campgrounds", campgroundRoutes);



/*
Campground.create(
	{name: "Granite Hill", image: "https://media-cdn.tripadvisor.com/media/photo-s/03/ce/e8/97/granite-hill-camping.jpg",
	 description: "This is a huge granite hill, no bashrooms. No water. Beautiful granite."
	}, function(err, campground){
	if(err){
		console.log(err);
	} else {
		console.log("NEWLY CREATED BACKGROUND: ");
		console.log(campground);
	}
});
*/


// PASSPORT CONFIGURATION








app.listen(3000, function(){
	console.log("The YelpCamp Server Has Started!");
});



/* 
campgrounds = [
		{name: "Salmon Creek", image: "https://img.hipcamp.com/image/upload/c_fill,f_auto,g_auto,h_960,q_60,w_1440/v1445485223/campground-photos/fnqqusfbuyxsyrizknsj.jpg"},
		{name: "Granite Hill", image: "https://media-cdn.tripadvisor.com/media/photo-s/03/ce/e8/97/granite-hill-camping.jpg"},
		{name: "Montain Goots rest", image: "https://www.mountainphotography.com/images/xl/20120826-Campsite-Goats.jpg"},
	{name: "Salmon Creek", image: "https://img.hipcamp.com/image/upload/c_fill,f_auto,g_auto,h_960,q_60,w_1440/v1445485223/campground-photos/fnqqusfbuyxsyrizknsj.jpg"},
		{name: "Granite Hill", image: "https://media-cdn.tripadvisor.com/media/photo-s/03/ce/e8/97/granite-hill-camping.jpg"},
		{name: "Montain Goots rest", image: "https://www.mountainphotography.com/images/xl/20120826-Campsite-Goats.jpg"}
];
*/