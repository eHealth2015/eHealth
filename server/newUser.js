Accounts.onCreateUser(function(options, user) {
	if (options.profile) {
		var type;
		if(options.profile.code != "") {
			var code = Codes.findOne({_id: options.profile.code});
		
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