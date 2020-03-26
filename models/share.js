var mongoose = require("mongoose");

var shareSchema = mongoose.Schema({
	title: String,
	text: String,
	time: String,
	author: {
		username: String,
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	}
});

module.exports = mongoose.model("Share", shareSchema);