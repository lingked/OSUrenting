var express = require("express");
var router = express.Router();
var Apartment = require("../models/apartment");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/", function(req, res){
	// Get all apartments from DB
	Apartment.find({}, function(err, allApartments){
		if(err){
			console.log(err);
		} else{
			res.render("apartments/index",{apartments: allApartments, currentUser: req.user});
		}
	});
});

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("apartments/new");
});

router.post("/", middleware.isLoggedIn, function(req, res){
	//res.send("YOU HIT THE POST ROUTE!");
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var homePage = "";
	var map="";
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newApartment={name: name, price: price, image: image, homePage: homePage, map: map, description: description, author: author};
	//apartments.push(newApartment);
	//Create a new apartment and save it to database
	Apartment.create(newApartment, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			console.log(newlyCreated);
			res.redirect("/apartments");
		}
	});
	// get data from form and add to apartments array
	//redirect to backgraound page
	//res.redirect("/apartments");
});


router.get("/:id", function(req, res){
	//find the apartment with provided ID
	Apartment.findById(req.params.id).populate("comments").exec(function(err, foundApartment){
		if(err){
			console.log(err);
		} else{
			console.log(foundApartment);
			res.render("apartments/show", {apartment: foundApartment});
		}
	});
});

// FIND ROOMMATE PAGE

router.get("/:id/roommate", function(req, res){
	res.render("apartments/roommate");
});

// EDIT APARTMENT ROUTE
router.get("/:id/edit", checkApartmentOnwership, function(req, res){
	// is user logged in

	Apartment.findById(req.params.id,function(err, foundApartment){
		res.render("apartments/edit",{apartment: foundApartment});
	});
		//otherwise, redirect
});
// UPDATE APARTMENT ROUTE

router.put("/:id", function(req, res){
	// find and update the correct apartment
	
	Apartment.findByIdAndUpdate(req.params.id, req.body.apartment, function(err,updatedApartment){
		if(err){
			res.redirect("/apartments");
		} else{
			res.redirect("/apartments/" + req.params.id);
		}
	});
	// redirect somewhere
});

// DESTROY APARTMENT ROUTE
router.delete("/:id", function(req, res){
	Apartment.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/apartments");
		} else{
			res.redirect("/apartments");
		}
	});
});


//middleware

function checkApartmentOnwership(req, res, next){
	if(req.isAuthenticated()){
		
		Apartment.findById(req.params.id,function(err, foundApartment){
			if(err){
				req.flash("error","Not found!");
				res.redirect("back");
			} else{
				// does user own the apartment?
				if(foundApartment.author.id.equals(req.user._id)){
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
