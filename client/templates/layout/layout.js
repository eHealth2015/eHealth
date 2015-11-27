Template.layout.events({
	'click .logout': function(event) {
		Accounts.logout();
	}
});

Template.layout.helpers({
	nbMessages: function() {
		return Messages.find().count();
	},
	whoIsActive: function() {
		return Session.get('whoIsActive');
	},
	receiver: function() {
		var receiverId = Router.current().getParams().hash;
		var user = Meteor.users.findOne({_id: receiverId});
		if(user) {
			Meteor.setTimeout(function() {$('#sendMessageModal').modal('show')}, 0);
			return {
				firstName: user.profile.firstName,
				lastName: user.profile.lastName
			};
		}
		else
			return null;
	}
});

Template.layout.onRendered(function () {
	$('#sendMessageModal').modal({
		onApprove: function() {
			var message = $("#message")[0].value;
			var receiverId = Router.current().getParams().hash;
			Messages.insert({
				sender: Meteor.userId(),
				receiver: receiverId,
				message: message
			});
			window.location.hash = "";
			return true;
		},
		onDeny: function() {
			window.location.hash = "";
			return true;
		},
		allowMultiple: true,
		detachable: false
	});
});