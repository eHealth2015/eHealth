Template.register.events({
	'submit form': function(event) {
		event.preventDefault();
		var email = $('input[type="email"]').first().val();
		var password1 = $('input[type="password"]').first().val();
		var password2 = $('input[type="password"]').first().val();

		if (password1 == password2) {
			// TODO css
			Accounts.createUser({
				email: email,
				password: password1
			}, function(error) {
				if (error) {
					// TODO
					console.error(error);
				} else {
					Router.go('/home');
				}
			});
		} else {
			// TODO
		}
	}
});