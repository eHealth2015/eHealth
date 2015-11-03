Router.configure({
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
	},
});

Router.route('/', function () {
	this.redirect('/home');
});

Router.route('/login', function () {
	this.layout('inputForm');
	this.render('login');
});

Router.route('/register', function () {
	this.layout('inputForm');
	this.render('register');
});

Router.route('/passwordRecovery/:token', function () {
	this.layout('inputForm');
	this.render('passwordRecovery');
});

Router.route('home');
Router.route('data');
Router.route('groups');
Router.route('settings');

// TODO : NEED TWO ROUTER CONTROLER TO CHANGE DEFAULT CONFIG