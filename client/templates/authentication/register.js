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
						// TODO SHOW ERROR
						console.error(error);
					} else {
						EncryptionUtils.onSignIn(password1);
						window.location.hash = 3;
					}
				});
			}
			else {
				// TODO ERROR DIFFERENT PASSSWORDS
				console.log("PASSWORDS ARE DIFFERENT");
			}
		}
		else {
			window.location.hash = 1;
		}
	},
	'click #patient': function() {
		Session.set('newuser', {
			type: "Patient"
		});
		window.location.hash = 2;
	},
	'click #medic': function() {
		Session.set('newuser', {
			type: "Medic"
		});
		window.location.hash = 2;
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
					three: "",
				};
			break;
		}
	},
	'newuser': function(type) {
		var newuser = Session.get('newuser');
		if(newuser && newuser.type)
			return newuser.type === type;
		else
			window.location.hash = 1;
		}
});

Template.register.onRendered(function() {
	$('select.dropdown').dropdown();
	if(window.location.hash === "#3" && !Meteor.userId())
		window.location.hash = 1;
});