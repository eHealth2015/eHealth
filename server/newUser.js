Accounts.onCreateUser(function(options, user) {
	user.profile = {};
	user.profile.type = "";
	user.profile.complete = "no";
	return user;
});