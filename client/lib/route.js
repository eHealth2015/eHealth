AuthRouter = RouteController.extend({
	layoutTemplate: 'inputForm',
});

AppRouter = RouteController.extend({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	waitOn: function() {
		return Meteor.subscribe("userData");
	},
	onBeforeAction: function () {
		var routeName = this.route.getName();
		if(!Meteor.userId()) {
			if(routeName != "login" && routeName != "register" && routeName != "passwordRecovery.:token") {
				this.redirect('/login');
			}
			else
				this.next();
		}
		else if(isUserUnset()) {
			if(routeName != "settings")
				this.redirect('/settings');
			else
				this.next();
		}
		else
			this.next();
	}
});

Router.route('/', {
	controller: 'AuthRouter',
	action: function () {
		this.redirect('/home');
	}
});

Router.route('/login', {
	controller: 'AuthRouter'
});

Router.route('/register', {
	controller: 'AuthRouter'
});

Router.route('/passwordRecovery/:token', {
	controller: 'AuthRouter'
});

Router.route('home', {
	controller: 'AppRouter'
});
Router.route('data', {
	controller: 'AppRouter'
});
Router.route('groups', {
	controller: 'AppRouter'
});
Router.route('settings', {
	controller: 'AppRouter'
});