Template.layout.events({
	'click .logout': function(event) {
		Accounts.logout();
		$("body").removeAttr("class");
	},
	'click .show-menu': function(event) {
		$('.ui.sidebar').sidebar('toggle');
	},
	'click .sidebar.menu .item': function(event) {
		$('.ui.sidebar').sidebar('hide');
	}
});

Template.layout.helpers({
	nbMessages: function() {
		return Messages.find({receiver: Meteor.userId(), read: false}).count();
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
			sendMessageTo(message, receiverId);
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