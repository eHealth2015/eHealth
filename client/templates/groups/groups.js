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
		if(isUserPatient()) {
			return {
				header: "Medical staff",
				people: "Medical doctor",
				groups: "Medical groups",
				peopleType: "medical doctor"
			};
		}
	},
	people: function() {
		if(isUserMedic()) {
			return [];
		}
		else if(isUserPatient()) {
			return [];
		}
		return [];
	},
	group: function() {
		var hash = Router.current().getParams().hash;
		if(hash != "") {
			var group = Groups.findOne({_id: hash});
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
				Meteor.setTimeout(function() {$('#groupDetailsModal').modal('show')}, 0);
				return group;
			}
			else
				return null;
		}
		else
			return null;
	},
	groups: function() {
		return Groups.find();
	}
});

Template.groups.events({
	'click #deletePatient': function(event) {
		var groupId = Router.current().getParams().hash;
		var patientId = event.currentTarget.getAttribute("patientId");
		Groups.update({_id: groupId}, {
			$pull: {
				patients: {
					_id: patientId
				}
			}
		});
	},
	'click #addPatient': function(event, template) {
		var newFirstName = template.find('#addPatientFirstName').value;
		var newLastName = template.find('#addPatientLastName').value;
		var groupId = Router.current().getParams().hash;
		Meteor.call('addPatient2group', newFirstName, newLastName, groupId, function(error) {
			if(error) {
				// TODO
				console.log("error");
				console.log(error);
			}
			else {
				Meteor.subscribe("userData");
				template.find('#addPatientFirstName').value = "";
				template.find('#addPatientLastName').value = "";
			}
		});
	},
	'click #addMedic': function(event, template) {
		var newFirstName = template.find('#addMedicFirstName').value;
		var newLastName = template.find('#addMedicLastName').value;
		var groupId = Router.current().getParams().hash;
		Meteor.call('addMedic2group', newFirstName, newLastName, groupId, function(error) {
			if(error) {
				// TODO
				console.log("error");
				console.log(error);
			}
			else {
				Meteor.subscribe("userData");
				template.find('#addMedicFirstName').value = "";
				template.find('#addMedicLastName').value = "";
			}
		});
	},
	'click #changeName': function(event, template) {
		var newName = template.find("#newName").value;
		var groupId = Router.current().getParams().hash;
		Groups.update({_id: groupId}, {
			$set: {
				name: newName
			}
		});
	},
	'click #deleteGroup1': function(event) {
		$("#deleteGroup1").hide();
		$("#deleteGroup2").show();
	},
	'click #deleteGroup2': function(event) {
		var groupId = Router.current().getParams().hash;
		Groups.remove({_id: groupId}, function(error) {
			if(error) {
				// TODO
				;
			}
			else {
				$('#groupDetailsModal').modal('hide');
			}
		});
	},
	'click #add': function(event) {
		event.preventDefault();
		$('.adding-group').show(500);
		$('#add').fadeOut(500);
	},
	'click #cancel-add': function(event) {
		event.preventDefault();
		$('.adding-group').hide(500);
		$('#add').fadeIn(500);
	},
	'submit form': function(event, template) {
		event.preventDefault();
		var name = template.find('#groupName').value;
		Groups.insert({
			name: name,
			patients: [],
			medics: [{_id: Meteor.userId(), admin: true}]
		}, function(error, id) {
			if(error) {
				// TODO
				;
			}
			else {
				$('.adding-group').hide(500);
				$('#add').fadeIn(500);
				template.find('#groupName').value = "";
			}
		});
	}
});

Template.groups.onRendered(function() {
	$('#groupDetailsModal').modal({
		onHide: function() {
			window.location.hash = "";
			return true;
		},
		detachable: false
	});
});