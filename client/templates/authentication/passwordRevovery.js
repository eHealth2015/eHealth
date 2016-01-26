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
						newMsg("error", error.message);
					} else {
						Router.go('/data');
						newMsg("sucess", "Password changed");
					}
				});
			}
			else {
				newMsg("error", "Error: empty token");
			}
		}
		else {
			newMsg("error", "Error: passwords are differents");
		}
	}
});