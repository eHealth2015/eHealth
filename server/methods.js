Meteor.methods({
	addPatient2medic: function(firstName, lastName) {
		if(this.userId && Meteor.users.findOne({_id: this.userId}).profile.type === "Medic") {
			var patient = Meteor.users.findOne({
				'profile.firstName': firstName,
				'profile.lastName': lastName
			});
			if(patient && patient.profile.type === "Patient") {
				Meteor.users.update({_id: this.userId}, {
					$addToSet: {
						'profile.patients': {
							_id: patient._id,
							confirmed: false
						}
					}
				});
			}
			else
				throw new Meteor.Error("user-unknown", "Can't find the user");
		}
		else
			return null;
	},
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
				$addToSet: {medics: {_id: user._id, admin: false}}
			});
		}
		else
			throw new Meteor.Error("user-unknown", "Can't find the user");
	},
	'deleteUser': function() {
		console.log("delete user");
		var array = isUserMedic() ? "medics" : "patients";
		var obj = {};
		obj[array] = {_id: this.userId};
		getGroupsByUserId(this.userId).forEach(function(group) {
			Groups.update({_id: group._id}, {
				$pull: obj
			});
		});
		Meteor.users.remove({_id: this.userId}, function(error) {
			if(error)
				console.log(error);
			else
				console.log("Delete user ok");
		});
	}
});