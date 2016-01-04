Codes = new Mongo.Collection('codes');

Codes.deny({
	insert: function(userId, doc) {
		return true;
	},
	update: function(userId, doc, fields, modifier) {
		return true;
	},
	remove: function(userId, doc) {
		return true;
	}
});