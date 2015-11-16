Meteor.methods({
	addPatient2group: function(firstName, lastName, groupId) {
		// TODO check if userID is admin in group
		var user = Meteor.users.findOne({
			'profile.firstName': firstName,
			'profile.lastName': lastName
		});
		if(user && user.profile.type === "Patient") {
			Groups.update({_id: groupId}, {
				$addToSet: {patients: {_id: user._id, confirmed: false}}
			});
		}
		else
			throw new Meteor.Error("user-unknown", "Can't find the user");
	},
	addMedic2group: function(firstName, lastName, groupId) {
		// TODO check if userID is admin in group
		var user = Meteor.users.findOne({
			'profile.firstName': firstName,
			'profile.lastName': lastName
		});
		if(user && user.profile.type === "Medic") {
			Groups.update({_id: groupId}, {
				$addToSet: {medics: {_id: user._id, confirmed: false}}
			});
		}
		else
			throw new Meteor.Error("user-unknown", "Can't find the user");
	}
});