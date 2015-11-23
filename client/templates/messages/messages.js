Template.messages.onRendered(function() {
	setActive("messages");
});

Template.messages.helpers({
	messages: function() {
		return Messages.find().fetch();
	}
});

Template.message.helpers({
	messageObj: function() {
		var message = Messages.findOne({_id: this._id});
		if(message) {
			var sender = Meteor.users.findOne({_id: message.sender});
			if(sender) {
				message.senderFirstName = sender.profile.firstName;
				message.senderLastName = sender.profile.lastName;
			}
		}
		return message;
	}
});