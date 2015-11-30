Template.layout.events({
	'click #bt': function(event) {
		if(Session.get('bt').connected)
			bluetooth.disconnect();
		else
			bluetooth.try2connect();
	},
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
	btTry2connect: function() {
		if(Session.get('bt').trying)
			return "active";
		else
			return "disabled";
	},
	color: function() {
		//if(Meteor.isCordova)
		var color = {};
		color.wifi = Meteor.status().connected ? "" : "opp";
		color.bluetooth = Session.get('bt').connected ? "" : "opp";
		return color;
	},
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