Template.login.helpers({
	fingerprint: function() {
		if(Meteor.isCordova && (fingerprint.apple || fingerprint.samsung)) {
			var available = window.localStorage.getItem("fingerprintAvailable");
			return available === "true";
		}
		else
			return false;
	}
});

Template.login.events({
	'click #fingerprint': function(event) {
		event.preventDefault();
		var email = window.localStorage.getItem("email");
		var password = window.localStorage.getItem("password");

		fingerprint.check(function() {
			Meteor.loginWithPassword(
				email,
				password,
				function(error) {
					if (error) {
						newMsg("error", error.message);
					} else {
						EncryptionUtils.onSignIn(password);
						Router.go('/data');
					}
				}
			);
		}, function() {
			newMsg("error", "Fail to login with fingerprint");
		});
	},
	'submit form': function(event, template) {
		event.preventDefault();
		var email = template.find('#email').value;
		var password = template.find('#password').value;
		if(email && email != "" && password && password != "") {
			Meteor.loginWithPassword(email, password, function(error) {
				if (error) {
					newMsg("error", error.message);
				} else {
					EncryptionUtils.onSignIn(password);
					window.localStorage.setItem("email", email);
					window.localStorage.setItem("password", password);
					window.localStorage.setItem("fingerprintAvailable", "true");
					Router.go('/data');
				}
			});
		}
	},
	'click .passwordRecovery': function(event, template) {
		event.preventDefault();
		var email = template.find('#email').value;

		if(email && email != "") {
			Accounts.forgotPassword({
				email: email
			}, function(error) {
				if(error) {
					newMsg("error", error.message);
				}
				else {
					newMsg("error", "An email has been sent");
				}
			});
		}
		else {
			newMsg("error", "Error: please enter your email");
		}
	}
});