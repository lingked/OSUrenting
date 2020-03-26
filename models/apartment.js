var mongoose = require("mongoose");

var apartmentSchema = new mongoose.Schema({
	name: String,
	price:String,
	image: String,
	description: String,
	homePage:String,
	map:String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	shares: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Share"
		}
	]
});

module.exports = mongoose.model("Apartment", apartmentSchema);