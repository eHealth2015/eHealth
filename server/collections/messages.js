Messages = new Mongo.Collection('messages');

Meteor.publish('messages', function() {
	if(this.userId)
		return Messages.find({
			$or: [
				{receiver: this.userId},
				{sender: this.userId}
			]
		});
	else
		this.ready();
});

Messages.allow({
	insert: function(userId, doc) {
		return (userId && doc.sender === userId);
	},
	update: function(userId, doc, fields, modifier) {
		return true;
	},
	remove: function(userId, doc) {
		return true;
	}
});