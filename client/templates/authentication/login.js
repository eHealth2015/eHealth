Template.login.events({
	'submit form': function(event, template) {
		event.preventDefault();
		var email = template.find('#email').value;
		var password = template.find('#password').value;

		Meteor.loginWithPassword(email, password, function(error) {
			if (error) {
				// TODO SHOW ERROR
				console.error(error);
			} else {
				EncryptionUtils.onSignIn(password);
				Router.go('/home');
			}
		});
	},
	'click .passwordRecovery': function(event, template) {
		event.preventDefault();
		var email = template.find('#email').value;

		if(email && email != "") {
			Accounts.forgotPassword({
				email: email
			}, function(error) {
				if(error) {
					//TODO SHOW ERROR
					console.log(error);
				}
				else {
					// TODO TELL THAT THE EMAIL HAS BEEN SENT
					console.log("EMAIL SENT");
				}
			});
		}
		else {
			// TODO : HIDE PASSWORD FIELD AND TELL THE USER TO GIVE HIS EMAIL FFS !
			console.log("PLEASE ENTER YOUR EMAIL");
		}
	}
});