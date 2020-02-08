var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/", function(req, res){
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/index",{campgrounds: allCampgrounds, currentUser: req.user});
		}
	});
});

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, function(req, res){
	//res.send("YOU HIT THE POST ROUTE!");
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground={name: name, price: price, image: image, description: description, author: author};
	//campgrounds.push(newCampground);
	//Create a new campground and save it to database
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			res.redirect("/campgrounds");
		}
	});
	// get data from form and add to campgrounds array
	//redirect to backgraound page
	//res.redirect("/campgrounds");
});


router.get("/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else{
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOnwership, function(req, res){
	// is user logged in

	Campground.findById(req.params.id,function(err, foundCampground){
		res.render("campgrounds/edit",{campground: foundCampground});
	});
		//otherwise, redirect
});
// UPDATE CAMPGROUND ROUTE

router.put("/:id", function(req, res){
	// find and update the correct campground
	
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	// redirect somewhere
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds");
		}
	});
});


//middleware

function checkCampgroundOnwership(req, res, next){
	if(req.isAuthenticated()){
		
		Campground.findById(req.params.id,function(err, foundCampground){
			if(err){
				req.flash("error","Not found!");
				res.redirect("back");
			} else{
				// does user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			}
		});
	} else{
		req.flash("error","You need to be logged in to do it");
		res.redirect("back");
	}
}

module.exports = router;
