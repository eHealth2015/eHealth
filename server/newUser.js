Accounts.onCreateUser(function(options, user) {

	// CHECK CODE
	var type;
	if(options && options.code != "") {
		var code = Codes.findOne({_id: options.code});
		
		if(!code || !options.profile.type === code.type)
			throw new Meteor.Error("newuser-deny", "Wrong code");
		else {
			type = code.type;
			Codes.update({_id: code._id}, {
				$set: {
					// TODO: put the new userID
					acceptDate: new Date()
				}
			});
		}
	}

	if (options.profile) {
    	user.profile = options.profile;
		if(type === "Medic") {
			user.patients = [];
		}
		else
			user.medics = [];
		return user;
	}
	else
		throw new Meteor.Error("newuser-malformed", "Malformed new user, registration aborted");
});