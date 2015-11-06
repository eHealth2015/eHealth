
Groups = new Mongo.Collection('groups');

function getGroupsByUserId(userId) {
	var user = Meteor.users.findOne({_id: userId});

	switch (user.profile.type) {
		case "Medic":
			return Groups.find({
				medics: {
					$elemMatch: {
						_id: userId
					}
				}
			});
			break;

		case "Patient":
			return Groups.find({
				patients: {
					$elemMatch: {
						_id: userId
					}
				}
			}, { fields: { patients: 0 }});
			break;

		default:
			break;
	}
};

Meteor.publish('groups', function() {
	if(this.userId)
		return getGroupsByUserId(this.userId);
	else
		this.ready();
});

Groups.allow({
	insert: function() {
		return true;
	},
	remove: function() {
		//TODO CHECK IF USER IS ADMIN
		return true;
	}
});

// Meteor.users.deny({
// 	update: function() {
// 		return true;
// 	}
// });

Meteor.publish("userData", function () {
	if (this.userId) {
		var groups = getGroupsByUserId(this.userId).fetch();
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
	} else {
		this.ready();
	}
});