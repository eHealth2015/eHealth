Template.layout.events({
	'click .logout': function(event) {
		event.preventDefault();
		Accounts.logout();
	}
});

Template.layout.helpers({
	'whoIsActive': function() {
		return Session.get('whoIsActive');
	}
})