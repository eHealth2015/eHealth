Template.groups.onRendered(function() {
	setActive("groups");
});

Template.groups.helpers({
	strings: function() {
		if(isUserMedic()) {
			return {
				header: "Medical groups",
				people: "Your patients",
				groups: "Your groups",
				peopleType: "patient"
			};
		}
		else if(isUserPatient()) {
			return {
				header: "Medical staff",
				people: "Medical doctor",
				groups: "Medical groups",
				peopleType: "medical doctor"
			};
		}
	},
	people: function() {
		Meteor.subscribe('getOtherUsers');
		if(isUserMedic()) {
			return Meteor.user().patients.map(function(patient) {
				var user = Meteor.users.findOne({_id: patient._id});
				if(user) {
					patient.firstName = user.profile.firstName;
					patient.lastName = user.profile.lastName;
					patient.gender = user.profile.gender;
				}
				return patient;
			});
		}
		else if(isUserPatient()) {
			return Meteor.user().medics.map(function(medic) {
				var user = Meteor.users.findOne({_id: medic._id});
				if(user) {
					medic.firstName = user.profile.firstName;
					medic.lastName = user.profile.lastName;
					medic.gender = user.profile.gender;
				}
				return medic;
			});
		}
		return [];
	},
	group: function() {
		var groupId = Router.current().getParams()._id;
		if(groupId != "") {
			var group = Groups.findOne({_id: groupId});
			if(group) {
				group.medics.map(function(medic) {
					var user = Meteor.users.findOne({_id: medic._id});
					if(user) {
						medic.firstName = user.profile.firstName;
						medic.lastName = user.profile.lastName;
						medic.title = user.profile.title;
					}
					if(medic._id === Meteor.userId())
						group.admin = medic.admin;
					return medic;
				});
				group.patients.map(function(patient) {
					var user = Meteor.users.findOne({_id: patient._id});
					if(user) {
						patient.firstName = user.profile.firstName;
						patient.lastName = user.profile.lastName;
						patient.gender = user.profile.gender;
					}
					return patient;
				});
				Meteor.setTimeout(function() {
					$('#groupDetailsModal').modal('show');
				}, 0);
				return group;
			}
			else
				return null;
		}
		else
			return null;
	},
	groups: function() {
		return Groups.find().fetch();
	}
});

Template.groups.events({
	'click #deletePatientFromMedic': function(event) {
		var patientId = this._id;
		Meteor.call('removePatient2medic', patientId, function(error) {
			if(error) {
				newErro(error.message);
			}
			else
				Meteor.subscribe("getOtherUsers");
		});
	},
	'click #deletePatientFromGroup': function(event) {
		var groupId = Router.current().getParams()._id;
		var patientId = this._id;
		Groups.update({_id: groupId}, {
			$pull: {
				patients: {
					_id: patientId
				}
			}
		});
	},
	'click #deleteMedicFromGroup': function(event) {
		var groupId = Router.current().getParams()._id;
		var medicId = this._id;
		Groups.update({_id: groupId}, {
			$pull: {
				medics: {
					_id: medicId
				}
			}
		});
	},
	'click #addPatient2group': function(event, template) {
		if(this.admin) {
			var newFirstName = template.find('#addPatientFirstName2group').value;
			var newLastName = template.find('#addPatientLastName2group').value;
			var groupId = this._id;
			Meteor.call('addPatient2group', newFirstName, newLastName, groupId, function(error) {
				if(error) {
					newMsg("error", error.message);
				}
				else {
					Meteor.subscribe("getOtherUsers")
					template.find('#addPatientFirstName2group').value = "";
					template.find('#addPatientLastName2group').value = "";
				}
			});
		}
	},
	'click #addMedic2group': function(event, template) {
		if(this.admin) {
			var newFirstName = template.find('#addMedicFirstName2group').value;
			var newLastName = template.find('#addMedicLastName2group').value;
			var groupId = this._id;
			Meteor.call('addMedic2group', newFirstName, newLastName, groupId, function(error) {
				if(error) {
					newMsg("error", error.message);
				}
				else {
					Meteor.subscribe("getOtherUsers")
					template.find('#addMedicFirstName2group').value = "";
					template.find('#addMedicLastName2group').value = "";
				}
			});
		}
	},
	'click #changeGroupName': function(event, template) {
		if(this.admin) {
			var newName = template.find("#newGroupName").value;
			var groupId = this._id;
			Groups.update({_id: groupId}, {
				$set: {
					name: newName
				}
			});
		}
	},
	'click #deleteGroup1': function(event) {
		if(this.admin) {
			$("#deleteGroup1").hide();
			$("#deleteGroup2").show();
		}
	},
	'click #deleteGroup2': function(event) {
		if(this.admin) {
			var groupId = this._id;
			Groups.remove({_id: groupId}, function(error) {
				if(error) {
					newMsg("error", error.message);
				}
				else {
					$('#groupDetailsModal').modal('hide');
				}
			});
		}
	},
	'click #addPatient': function(event) {
		event.preventDefault();
		$('.adding-patient').show(500);
		$('#addPatient').fadeOut(500);
		$('#addPatientFirstName').focus();
	},
	'click #addGroup': function(event) {
		event.preventDefault();
		$('.adding-group').show(500);
		$('#addGroup').fadeOut(500);
		$('#groupName').focus();
	},
	'click #cancelAddPatient': function(event) {
		event.preventDefault();
		$('.adding-patient').hide(500);
		$('#addPatient').fadeIn(500);
	},
	'click #cancelAddGroup': function(event) {
		event.preventDefault();
		$('.adding-group').hide(500);
		$('#addGroup').fadeIn(500);
	},
	'submit #addPatientForm': function(event, template) {
		event.preventDefault();
		var firstName = template.find("#addPatientFirstName").value;
		var lastName = template.find("#addPatientLastName").value;
		Meteor.call('addPatient2medic', firstName, lastName, function(error) {
			if(error)
				console.log(error);
			else {
				Meteor.subscribe("getOtherUsers")
				$('.adding-patient').hide(500);
				$('#addPatient').fadeIn(500);
				template.find('#addPatientFirstName').value = "";
				template.find('#addPatientLastName').value = "";
			}
		})
	},
	'submit #addGroupForm': function(event, template) {
		event.preventDefault();
		var name = template.find('#groupName').value;
		Groups.insert({
			name: name,
			patients: [],
			medics: [{_id: Meteor.userId(), admin: true}]
		}, function(error, id) {
			if(error) {
				newMsg("error", error.message);
			}
			else {
				$('.adding-group').hide(500);
				$('#addGroup').fadeIn(500);
				template.find('#groupName').value = "";
			}
		});
	}
});

Template.groups.onRendered(function() {
	$('#groupDetailsModal').modal({
		onHidden: function() {
			$('body').removeAttr('style');
			Router.go('/groups');
			return true;
		},
		onVisible: function() {
			$("body").css({
				'min-height': $('#groupDetailsModal').height() + 100
			});
		},
		detachable: false,
		allowMultiple: true,
		autofocus: false
	});
});