Accounts.onResetPasswordLink(function(token) {
	Router.go('/passwordRecovery/'+token);
});

Session.setDefault('state', 'locked');

Session.setDefault('whoIsActive', {
	'home': "active",
	'data': "",
	'groups': "",
	'messages': "",
	'settings': "",
	"dev": ""
});

setActive = function(name) {
	var obj = {
		'home': "",
		'data': "",
		'groups': "",
		'messages': "",
		'settings': "",
		"dev": ""
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

Template.registerHelper('isAndroid', function() {
	if(Meteor.isCordova)
		return device.platform === "Android";
	else
		return false;
});

Template.registerHelper('isiOS', function() {
	if(Meteor.isCordova)
		return device.platform === "iOS";
	else
		return false;
});

EncryptionUtils.configure({
	enforceEmailVerification: false
});