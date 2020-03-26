var express = require("express");
var router = express.Router();
var Apartment = require("../models/apartment");
var Share = require("../models/share");
var middleware = require("../middleware");

// Shares show

router.get("/:id/shares", function(req, res){
	Apartment.findById(req.params.id).populate("shares").exec(function(err, foundApartment){
		if(err){
			res.redirect("back");
		} else {
			res.render("shares/show", {apartment: foundApartment, currentUser: req.user});
		}
	});
});

// Share detail
router.get("/:id/shares/:share_id/details", function(req, res){
	Apartment.findById(req.params.id, function(err, foundApartment){
		if(err){
			res.redirect("back");
		} else{
			Share.findById(req.params.share_id, function(err, foundShare){
				if(err){s
					res.redirect("back");
				} else {
					res.render("shares/details", {apartment: foundApartment, share: foundShare});
				}
			});
		}
	});
});

// Shares new

router.get("/:id/shares/new", middleware.isLoggedIn, function(req, res){
	// find apartment by id
	Apartment.findById(req.params.id, function (err, apartment){
		if(err){
			res.render("back");
		} else {
			res.render("shares/new", {apartment: apartment});
		}
	});
});


// Shares create

router.post("/:id/shares", middleware.isLoggedIn, function(req, res){
	// find apartment by ID
	Apartment.findById(req.params.id, function(err, apartment){
		if(err){
			res.render("back");
		} else {
			Share.create(req.body.share, function(err, share){
				if(err){
					res.render("back");
				} else {
					// add username and id to share
					share.author.id = req.user._id;
					share.author.username = req.user.username;
					const currentTime = new Date();
					share.time = currentTime.toString().substring(0,24);
					// save share
					share.save();
					apartment.shares.push(share);
					apartment.save();
					res.redirect("/apartments/"+req.params.id+"/shares");
				}
			});
		}
	});
});

// Share edit

router.get("/:id/shares/:share_id/edit", middleware.checkShareOwnership, function(req, res){
	Share.findById(req.params.share_id, function(err, foundShare){
		if(err){
			res.redirect("back");
		} else{
			res.render("shares/edit", {apartment_id: req.params.id, share: foundShare});
		}
	});
});

// share update
router.put("/:id/shares/:share_id", function(req, res){
	Share.findByIdAndUpdate(req.params.share_id, req.body.share, function(err, updatedShares){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/apartments/"+req.params.id+"/shares");
		}
	});
});

// Share destroy router

router.delete("/:id/shares/:share_id", middleware.checkShareOwnership, function(req, res){
	console.log(req.params.share_id);
	Share.findByIdAndRemove(req.params.share_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/apartments/"+req.params.id+"/shares");
		}
	});
});





module.exports = router;