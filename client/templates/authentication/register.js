Template.register.events({
	'submit form': function(event, template) {
		event.preventDefault();
		var email = template.find('#email').value;
		var password1 = template.find('#password1').value;
		var password2 = template.find('#password2').value;

		if(password1 === password2) {
			Accounts.createUser({
				email: email,
				password: password1
			}, function(error) {
				if (error) {
					// TODO SHOW ERROR
					console.error(error);
				} else {
					Router.go('/home');
				}
			});
		}
		else {
			// TODO ERROR DIFFERENT PASSSWORDS
			console.log("PASSWORDS ARE DIFFERENT");
		}
	}
});