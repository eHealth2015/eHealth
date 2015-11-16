Accounts.onCreateUser(function(options, user) {
	if(user.profile.type === "Medic") {
		user.profile.patients = [];
	}
	user.profile.publicKey = "";
	user.profile.privateKey = "";
	return user;
});