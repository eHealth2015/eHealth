Groups = new Mongo.Collection('groups');

getGroupsByUserId = function (userId) {
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
			return null;
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
	insert: function(userId) {
		if(Meteor.users.findOne({_id: userId}).profile.type === "Medic")
			return true;
		else
			return false;
	},
	update: function(userId) {
		// TODO CHECK IF ADMIN
		return true;
	},
	remove: function(userId, doc) {
		for(var i = 0; i < doc.medics.length; i++) {
			if(doc.medics[i]._id === userId)
				return doc.medics[i].admin;
		}
		return false;
	}
});
