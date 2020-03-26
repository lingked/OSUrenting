var Apartment=require("../models/apartment");
var Comment=require("../models/comment");
var Share=require("../models/share");
// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkApartmentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Apartment.findById(req.params.id,function(err, foundApartment){
			if(err){
				res.redirect("back");
			} else{
				// does user own the apartment?
				if(foundApartment.author.id.equals(req.user._id)){
					next();
				} else{
					res.redirect("back");
				}
			}
		});
	} else{
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err, foundComment){
			if(err){
				res.redirect("back");
			} else{
				// does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else{
					res.redirect("back");
				}
			}
		});
	} else{
		res.redirect("back");
	}
}

middlewareObj.checkShareOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Share.findById(req.params.share_id, function(err, foundShare){
			if(err){
				res.redirect("back");
			} else{
				if(foundShare.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do it");
	res.redirect("/login");
}

module.exports = middlewareObj;