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
	groups: function() {
		return Groups.find().fetch().map(function(group) {
			group.medics.map(function(medic) {
				var user = Meteor.users.findOne({_id: medic._id})
				medic.firstName = user.profile.firstName;
				medic.lastName = user.profile.lastName;
				return medic;
			});
			if(group.patients)
				group.patients.map(function(patient) {
					var user = Meteor.users.findOne({_id: patient._id})
					patient.firstName = user.profile.firstName;
					patient.lastName = user.profile.lastName;
					return patient;
				});
			return group;
		});
	}
});

Template.groups.events({
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
	'click #deleteGroup': function(event) {
		event.preventDefault();
		var groupId = event.currentTarget.getAttribute("groupId");
		Groups.remove({_id: groupId});
	},
	'submit form': function(event, template) {
		event.preventDefault();
		var name = template.find('#groupName').value;
		Groups.insert({
			name: name,
			patients: [],
			medics: [{_id: Meteor.userId(), admin: true}]
		});
	}
});

Template.groups.onRendered(function() {

});