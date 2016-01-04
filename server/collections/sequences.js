Sequences = new Mongo.Collection('sequences');

Meteor.publish('sequences', function() {
	if(this.userId) {
		this.added();
		var thisUser =  Meteor.users.findOne({_id: this.userId});
		if(thisUser.profile.type === "Patient")
			return Sequences.find({userId: this.userId});
		else
			return Sequences.find({
				userId: {
					$in: thisUser.patients
				}
			});
	}
	else
		this.ready();
});

Sequences.allow({
	insert: function(userId, doc) {
		return true;
		// if(Sequences.findOne({userId: userId}))
		// 	return true;
		// else
		// 	return false;
	},
	update: function(userId, doc, fields, modifier) {
		if(doc.userId === userId)
			return true;
		else
			return false;
	},
	remove: function(userId, doc) {
		return false;
	}
});