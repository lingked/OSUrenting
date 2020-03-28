var mongoose = require("mongoose");

var shareSchema = mongoose.Schema({
	title: String,
	text: String,
	contact: String,
	time: String,
	apartmentName: String,
	apartmentId: String,
	image: {
		type:[String],
		length: 3
	},
	author: {
		username: String,
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	}
});

module.exports = mongoose.model("Share", shareSchema);