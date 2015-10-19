Template.login.events({
	'click .login': function(event) {
		var email = $('input[type="email"]').first().val();
		var password = $('input[type="password"]').first().val();

		Meteor.loginWithPassword(email, password, function(error) {
			if (error) {
				// TODO
				console.error(error);
			} else {
				Router.go('/home');
			}
		});
	}
});