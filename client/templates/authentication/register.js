Template.register.events({
	'submit form': function(event, template) {
		event.preventDefault();
		var newuser = Session.get('newuser');
		if(newuser && newuser.type) {
			newuser.firstName = template.find('#firstName').value;
			newuser.lastName = template.find('#lastName').value;
			email = template.find('#email').value;

			var password1 = template.find('#password1').value;
			var password2 = template.find('#password2').value;

			if(password1 == password2) {
				switch(newuser.type) {
					case "Patient":
						newuser.gender = template.find('#gender').value;
					break;
					case "Medic":
						newuser.title = template.find('#title').value;
					break;
				}
				Accounts.createUser({
					email: email,
					password: password1,
					profile: newuser
				}, function(error) {
					if (error) {
						newMsg("error", error.message);
					} else {
						EncryptionUtils.onSignIn(password1);
						updateLocationHash(3);
					}
				});
			}
			else {
				newMsg("error", "Error: passwords are differents");
			}
		}
		else {
			updateLocationHash(1);
		}
	},
	'click #patient': function() {
		Session.set('newuser', {
			type: "Patient"
		});
		updateLocationHash(2);
	},
	'click #medic': function() {
		Session.set('newuser', {
			type: "Medic"
		});
		updateLocationHash(2);
	},
	'click a.step': function(event, template) {
		var url = event.currentTarget.href;
		var hash = url[url.length-1];
		updateLocationHash(hash);
	}
});

Template.register.helpers({
	'email': function() {
		if(Meteor.user())
			return Meteor.user().emails[0];
	},
	'profile': function() {
		if(Meteor.user())
			return Meteor.user().profile;
	},
	'hash': function(number) {
		return Router.current().getParams().hash == number;
	},
	'steps': function(number) {
		switch(Session.get('hash')) {
			case "#3":
				return {one: "completed",
					two: "completed",
					three: "active"
				};
			break;
			case "#2":
				return {one: "completed",
					two: "active",
					three: ""
				};
			break;
			default:
				return {one: "active",
					two: "",
					three: ""
				};
			break;
		}
	},
	'newuser': function(type) {
		var newuser = Session.get('newuser');
		if (newuser && newuser.type)
			return newuser.type === type;
		else {
			updateLocationHash(1);
		}
	}
});

Template.register.onRendered(function() {
	$('select.dropdown').dropdown();
	if(window.location.hash === "#3" && !Meteor.userId()) {
		updateLocationHash(1);
	} else if (window.location.hash === "#2" && !Meteor.userId()) {
		updateLocationHash(2);
	} else if (window.location.hash === "#1") {
		updateLocationHash(1);
	}
});

function updateLocationHash(number) {
	Session.set('hash', '#' + number);
	window.location.hash = number;
}