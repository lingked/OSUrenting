var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments new

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
	// find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else{
			console.log(campground);
			res.render("comments/new", {campground: campground});
			
		}
	});
	//res.render("comments/new");
});

//Comments create

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					console.log(comment.author.username);
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("sucess", "Successfully add a comment!");
					res.redirect('/campgrounds/' + campground._id);
				}
			});
			//console.log(req.body.comment);
		}
	});

});

// comment edit
router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOnwership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
	
});

// comment update
///campgrounds/:id/comments/:id/
router.put("/campgrounds/:id/comments/:comment_id", function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedcomments){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// COMMENT DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", checkCommentOnwership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "The comment has been deleted");
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});

function checkCommentOnwership(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err, foundComment){
			if(err){
				res.redirect("back");
			} else{
				// does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "You don't have permisssion to do that");
					res.redirect("back");
				}
			}
		});
	} else{
		req.flash("error", "You need to login first");
		res.redirect("back");
	}
}


module.exports = router;