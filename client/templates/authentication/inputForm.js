Template.inputForm.onRendered(function() {
	if(Meteor.userId())
		Router.go('home');
});