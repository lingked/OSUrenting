var express = require("express");
var router = express.Router();
var Apartment = require("../models/apartment");
var Share = require("../models/share");
var middleware = require("../middleware");
var multer = require("multer");
var path = require("path");


let id = 0;

var storage = multer.diskStorage({
	destination: './public/photos/',
	filename: function(req, file, cb){
		
		cb(null, file.fieldname + new Date().toISOString()+ id +
		  path.extname(file.originalname));
		id++;
		id==3? 0:id;
	}
});

var upload = multer({
	storage: storage, 
	limit: {
		fileSize: 1024 * 1024 * 5
	}
}).array('myImage',3);

// Shares show all

router.get("/shares", function(req, res){
	Apartment.find({}, function(err, allApartments){
		Share.find({}, function(err, allShares){
			if(err){
				res.redirect("back");
			} else {
				res.render("shares/showAll", {shares: allShares, apartments: allApartments});
			}
		});
	});
});

// Shares show

router.get("/apartments/:id/shares", function(req, res){
	Apartment.find({}, function(err, allApartments){
		if(err) res.redirect("back");
		Apartment.findById(req.params.id).populate("shares").exec(function(err, foundApartment){
			if(err){
				res.redirect("back");
			} else {
				res.render("shares/show", {apartments: allApartments, apartment: foundApartment, currentUser: req.user});
			}
		});
	});
	
});

// Share detail for each apartment
router.get("/apartments/:id/shares/:share_id/details", function(req, res){
	Apartment.findById(req.params.id, function(err, foundApartment){
		if(err){
			res.redirect("back");
		} else{
			Share.findById(req.params.share_id, function(err, foundShare){
				if(err){
					res.redirect("back");
				} else {
					res.render("shares/details", {apartment: foundApartment, share: foundShare});
				}
			});
		}
	});
});

// Shares new

router.get("/apartments/:id/shares/new", middleware.isLoggedIn, function(req, res){
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

router.post("/apartments/:id/shares", middleware.isLoggedIn, function(req, res){
	// find apartment by ID
	upload(req, res, function(err){
		if(err instanceof multer.MulterError){
			res.render("back");
		} else{
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
							share.apartmentName = apartment.name;
							share.apartmentId = req.params.id;
							//console.log(req);
							req.files.forEach(function(file){
								share.image.push(file.path);
							});

							// console.log(share.image[0]);
							// save share
							share.save();
							apartment.shares.push(share);
							apartment.save();
							res.redirect("/apartments/"+req.params.id+"/shares");
						}
					});
				}
			});
		}
	});
});

// Share edit

router.get("/apartments/:id/shares/:share_id/edit", middleware.checkShareOwnership, function(req, res){
	Share.findById(req.params.share_id, function(err, foundShare){
		if(err){
			res.redirect("back");
		} else{
			res.render("shares/edit", {apartment_id: req.params.id, share: foundShare});
		}
	});
});

// share update
router.put("/apartments/:id/shares/:share_id", function(req, res){
	Share.findByIdAndUpdate(req.params.share_id, req.body.share, function(err, updatedShares){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/apartments/"+req.params.id+"/shares");
		}
	});
});

// Share destroy router
router.delete("/apartments/:id/shares/:share_id", middleware.checkShareOwnership, function(req, res){
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