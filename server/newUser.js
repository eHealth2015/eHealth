Accounts.onCreateUser(function(options, user) {

	// CHECK CODE

	// if(options && options.code != "") {
	// 	var code = Codes.findOne({_id: options.code});
		
	// 	if(!code || !options.profile.type === code.type)
	// 		throw new Meteor.Error("newuser-deny", "Wrong code");

	// 	// TODO
	// 	// 

	// }

	if (options.profile) {
    	user.profile = options.profile;
		if(user.profile.type === "Medic") {
			user.patients = [];
		}
		else
			user.medics = [];
		return user;
	}
	else
		throw new Meteor.Error("newuser-malformed", "Malformed new user, registration aborted");
});