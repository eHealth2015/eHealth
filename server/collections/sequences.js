Sequences = new Mongo.Collection('sequences');

Meteor.publish('sequences', function() {
	if(this.userId) {
		this.added();
		var thisUser =  Meteor.users.findOne({_id: this.userId});
		if(thisUser.profile.type === "Patient")
			return Sequences.find({userId: this.userId});
		else {
			var ids = thisUser.patients.map(function(e) {
						return e._id;
			});
			var groupsCursor = getGroupsByUserId(this.userId);
			if(groupsCursor) {
				var groups = groupsCursor.fetch();
				if(groups && groups.length > 0)
					for(var i = 0, group = groups[0]; i < groups.length; i++, group = groups[i])
						for(var j = 0; j < group.patients.length; j++)
							ids.push(group.patients[j]._id);
			}
			return Sequences.find({
				userId: {
					$in: ids
				}
			});
		}
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