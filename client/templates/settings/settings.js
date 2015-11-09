Template.settings.helpers({
	'email': function() {
		return Meteor.user().emails[0];
	},
	'profile': function() {
		return Meteor.user().profile;
	}
});

Template.settings.events({
	'click #sendVerifEmail': function(event) {
		event.preventDefault();
		// TODO
		console.log("TODO");
	},
	'click #settings': function(event) {
		event.preventDefault();
		$('#modalEdit').modal('show');
	},
	'click #delete': function(event) {
		event.preventDefault();
		$('#modalDelete').modal('show');
	}
});

Template.settings.onRendered(function() {
	setActive("settings");
	$('select.dropdown').dropdown();
	$('#modalEdit').modal({
		onApprove : function() {
			var profile = {
				firstName: $('#firstName')[0].value,
				lastName: $('#lastName')[0].value,
			};
			var email = $('#email')[0].value;
			if(isUserMedic()) {
				profile.title = $('#title')[0].value;
				profile.type = "Medic";
			}
			if(isUserPatient()) {
				profile.gender = $('#gender')[0].value;
				profile.type = "Patient";
			}
			Meteor.users.update({_id: Meteor.userId()}, {
				$set: {
					emails: [{address: email, verified: false}],
					profile: profile
				}
			});
			return true;
		}
	});
	$('#modalDelete').modal({
		onApprove : function() {
			Meteor.users.remove({_id: Meteor.userId()});
			Router.go('/login');
			return true;
		}
	});
});