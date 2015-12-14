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
			var currentEmailAddr = Meteor.user().emails[0].address;

			var firstName = $('#firstName')[0].value;
			var lastName = $('#lastName')[0].value;
			var email = $('#email')[0].value;

			var obj = {};
			obj['profile.firstName'] = firstName;
			obj['profile.lastName'] = lastName;

			if(email != currentEmailAddr)
				obj.emails = [{address: email, verified: false}];

			if(isUserMedic())
				obj['profile.title'] = $('#title')[0].value;

			else if(isUserPatient())
				obj['profile.gender'] = $('#gender')[0].value;

			Meteor.users.update({_id: Meteor.userId()}, {
				$set: obj
			});
			return true;
		}
	});
	$('#modalDelete').modal({
		detachable: false,
		autofocus: false,
		onApprove: function() {
			Meteor.call('deleteUser');
			Router.go('/login');
			return true;
		}
	});
	//if(Meteor.isCordova) {
		$("#progressStorage").progress({
			showActivity: false,  
			percent: 50 // TODO
		});
	//}
});