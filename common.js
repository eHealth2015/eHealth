isUserMedic = function() {
	if(Meteor.user() && Meteor.user().profile)
		return Meteor.user().profile.type === "Medic";
	else
		return false;
}

isUserPatient = function() {
	if(Meteor.user() && Meteor.user().profile)
		return Meteor.user().profile.type === "Patient";
	else
		return false;
}

isUserUnset = function() {
	if(Meteor.user() && Meteor.user().profile)
		return Meteor.user().profile.type === "";
	else
		return true;
}