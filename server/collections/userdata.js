// Meteor.users.deny({
// 	update: function() {
// 		return true;
// 	}
// });

Meteor.users.allow({
	update: function() {
		// TODO : check if it is ok...
		return true;
	},
	remove: function(userId, doc) {
		if(doc._id === userId)
			return true;
		else
			return false;
	}
});

Meteor.publish("userData", function () {
	if (this.userId) {
		var groupsCursor = getGroupsByUserId(this.userId);
		if(groupsCursor) {
			var groups = groupsCursor.fetch();
			var ids = [];
			for(var i = 0, group = groups[0]; i < groups.length; i++, group = groups[i]) {
				for(var j = 0; j < group.medics.length; j++)
					ids.push(group.medics[j]._id);
				if(group.patients)
					for(var j = 0; j < group.patients.length; j++)
						ids.push(group.patients[j]._id);
			}
			return Meteor.users.find({
					_id: { $in: ids}
				}, {
					fields: {
						'profile.firstName': 1,
						'profile.lastName': 1
					}
				});
		}
		else
			this.ready();
	} else
		this.ready();
});