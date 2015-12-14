Accounts.onCreateUser(function(options, user) {
	if (options.profile) {
    	user.profile = options.profile;
		if(user.profile.type === "Medic") {
			user.patients = [];
		}
		else
			user.sequences = [];
		return user;
	}
	else
		throw new Meteor.Error("newuser-malformed", "Malformed new user, registration aborted");
});