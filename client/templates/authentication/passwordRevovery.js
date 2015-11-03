Template.passwordRecovery.events({
	'submit form': function(event, template) {
		event.preventDefault();
		var password1 = template.find('#password1').value;
		var password2 = template.find('#password2').value;
		var token = Router.current().params.token;

		if(password1 === password2) {
			if(token && token != "") {
				Accounts.resetPassword(token, password1, function(error){
					if (error) {
						// TODO SHOW ERROR
						console.error(error);
					} else {
						Router.go('/home');
						// TODO TELL PASSWORD CHANGED
						console.log("PASSWORD CHANGED");
					}
				});
			}
			else {
				// TODO TOKEN EMPTY
				console.log("EMPTY TOKEN");
			}
		}
		else {
			// TODO ERROR DIFFERENT PASSSWORDS
			console.log("PASSWORDS ARE DIFFERENT")
		}
	}
});