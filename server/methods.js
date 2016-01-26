Meteor.methods({
	addPatient2medic: function(firstName, lastName) {
		if(this.userId) {
			if(Meteor.user().profile.type === "Medic") {
				var patient = Meteor.users.findOne({
					'profile.firstName': firstName,
					'profile.lastName': lastName
				});
				if(patient && patient.profile.type === "Patient") {
					Meteor.users.update({_id: this.userId}, {
						$addToSet: {
							'patients': {
								_id: patient._id,
								confirmed: false
							}
						}
					});
					Meteor.users.update({_id: patient._id}, {
						$addToSet: {
							'medics': {
								_id: this.userId,
								confirmed: false
							}
						}
					});
				}
				else
					throw new Meteor.Error("user-unknown", "Can't find the user");
			}
			else
				throw new Meteor.Error("wrong-account-type", "You are not allowed to do this action");
		}
		else
			throw new Meteor.Error("loggin-needed", "You need to be logged in to do this action");
	},
	removePatient2medic: function(patientID) {
		if(this.userId) {
			if(Meteor.user().profile.type === "Medic") {
				var patient = Meteor.users.findOne({_id: patientID});
				if(patient && patient.profile.type === "Patient") {
					Meteor.users.update({
						_id: patientID
					}, {
						$pull: {
							'medics': {
								_id: this.userId
							}
						}
					});
					Meteor.users.update({_id: this.userId}, {
						$pull: {
							'patients': {
								_id: patientID
							}
						}
					});
				}
				else
					throw new Meteor.Error("user-unknown", "Can't find the user or the user is not a patient");
			}
			else
				throw new Meteor.Error("wrong-account-type", "You are not allowed to do this action");
		}
		else
			throw new Meteor.Error("loggin-needed", "You need to be logged in to do this action");
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
	},

	'invite': function(emailAddr, type) {
		// CHECK IF AUTHORISED
		var code = Codes.insert({
			createDate: new Date(),
			userIdFrom: this.userId,
			userIdTo: null,
			acceptDate: null,
			type: type
		});
		console.log("New code: ");
		console.log(code);
		console.log("TODO SEND EMAIL");
	}
});