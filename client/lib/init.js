Accounts.onResetPasswordLink(function(token) {
	Router.go('/passwordRecovery/'+token);
});

Session.setDefault('whoIsActive', {
	'home': "active",
	'data': "",
	'groups': "",
	'settings': "",
});

setActive = function(name) {
	var obj = {
		'home': "",
		'data': "",
		'groups': "",
		'settings': "",
	};
	obj[name] = "active";
	Session.set('whoIsActive', obj);
};

Template.registerHelper('isUserMedic', function() {
	if(Meteor.user() && Meteor.user().profile)
		return Meteor.user().profile.type === "Medic";
	else
		return false;
});

Template.registerHelper('isUserPatient', function() {
	if(Meteor.user() && Meteor.user().profile)
		return Meteor.user().profile.type === "Patient";
	else
		return false;
});

Template.registerHelper('isUserUnset', function() {
	if(Meteor.user() && Meteor.user().profile)
		return Meteor.user().profile.type === "";
	else
		return true;
});

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