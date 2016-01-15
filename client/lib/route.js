AuthRouter = RouteController.extend({
	layoutTemplate: 'inputForm',
});

AppRouter = RouteController.extend({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	subscriptions: function() {
		this.subscribe('principals');
		this.subscribe('groups');
		this.subscribe('messages');
		// etc
	},
	waitOn: function() {
		return [
			Meteor.subscribe("userData"),
			Meteor.subscribe("getOtherUsers")
		];
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

Router.route('/passwordRecovery/:token?', {
	template: 'passwordRecovery',
	controller: 'AuthRouter',
	action: function() {
		if(this.params.token)
			this.render();
		else
			this.redirect("/login");
	}
});

Router.route('/home', {
	controller: 'AppRouter'
});
Router.route('/data/:userId?/:sequenceId?', {
	template: 'data',
	controller: 'AppRouter',
	onBeforeAction: function() {
		if (isUserPatient() && this.params.userId != Meteor.userId()) {
			this.redirect("/data/" + Meteor.userId());
		} else {
			this.render();
		}
	}
});
Router.route('/groups/:_id?', {
	template: 'groups',
	controller: 'AppRouter'
});
Router.route('messages', {
	controller: 'AppRouter'
});
Router.route('settings', {
	controller: 'AppRouter'
});

Router.route('dev', {
	controller: 'AppRouter'
});