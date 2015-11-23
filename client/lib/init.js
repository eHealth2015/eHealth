Accounts.onResetPasswordLink(function(token) {
	Router.go('/passwordRecovery/'+token);
});

Session.setDefault('whoIsActive', {
	'home': "active",
	'data': "",
	'groups': "",
	'messages': "",
	'settings': "",
});

setActive = function(name) {
	var obj = {
		'home': "",
		'data': "",
		'groups': "",
		'messages': "",
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

Template.registerHelper('isCordova', function() {
	return Meteor.isCordova;
});

EncryptionUtils.configure({
	enforceEmailVerification: false
});