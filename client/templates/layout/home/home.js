Template.home.events({
	'click .logout': function(event) {
		Meteor.logout();
	}
});