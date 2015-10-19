Router.configure({
	layoutTemplate: 'layout',
	onBeforeAction: function () {
		if(!Meteor.userId()) {
			if(this.url != "/login" && this.url != "/register")
				this.redirect('/login');
		}
		this.next();
	},
});

Router.route('/', function () {
	this.redirect('/home');
});

Router.route('/login', function () {
	this.layout('authentication');
	this.render('login');
});

Router.route('/register', function () {
	this.layout('authentication');
	this.render('register');
});

Router.route('/home');