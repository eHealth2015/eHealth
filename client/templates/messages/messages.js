Template.messages.onRendered(function() {
	setActive("messages");
});

sendMessageTo = function(message, to) {
	Messages.insert({
		sender: Meteor.userId(),
		receiver: to,
		read: false,
		date: new Date(),
		message: message
	});
}

Template.messages.helpers({
	name: function() {
		var id = Router.current().params._id;
		if(id) {
			var user = Meteor.users.findOne({_id: id});
			return {
				firstName: (user && user.profile.firstName) ? user.profile.firstName : "User",
				lastName: user.profile.lastName ? user.profile.lastName : "Unknown",
				title: user.profile.title ? user.profile.title : "Patient"
			}
		}
	},
	view: function() {
		return Router.current().params._id != null;
	},
	people: function() {
		var messages = Messages.find().fetch();

		var set = new Set();
		var infos = {};
		var userId = Meteor.userId();

		for(var i = 0; i < messages.length; i++) {
			var id = messages[i].sender === userId ? messages[i].receiver : messages[i].sender;
			if(set.has(id)) {
				infos[id].number++;
				if(infos[id].lastMessage < messages[i].date)
					infos[id].lastMessage = messages[i].date;
			}
			else {
				set.add(id);
				infos[id] = {
					number: 1,
					lastMessage:  messages[i].date
				};
			}
		}

		return Array.from(set).map(function(id) {
			var user = Meteor.users.findOne({_id: id});
			var date = infos[id].lastMessage;
			return {
				id: id,
				firstName: user && user.profile.firstName ? user.profile.firstName : "User",
				lastName: user.profile.lastName ? user.profile.lastName : "Unknown",
				title: user.profile.title ? user.profile.title : "Patient",
				number: infos[id].number,
				lastMessage: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " - " + date.getHours() + ":" + date.getMinutes()
			};
		});	
	},
	messages: function() {
		var id = Router.current().params._id;
		return Messages.find({
			$or: [
				{receiver: id},
				{sender: id}
			]
		}, {sort: {date: -1}});
	}
});

Template.messages.events({
	'submit': function(event, template) {
		event.preventDefault();
		var message = template.find('#newMessage').value;
		if(message != "") {
			sendMessageTo(message, Router.current().params._id);
			template.find('#newMessage').value = "";
		}
	}
})

Template.message.helpers({
	message: function() {
		var msg = Messages.findOne({_id: this._id});
		var date = msg.date;
		var r = {
			text: msg.message,
			selfSender: msg.sender === Meteor.userId(),
			date: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " - " + date.getHours() + ":" + date.getMinutes(),
			new: msg.read ? "" : "floating"
		};
		if(msg.receiver === Meteor.userId()) 
			Messages.update({_id: msg._id}, {
				$set: {
					read: true
				}
			});
		return r;
	}
});