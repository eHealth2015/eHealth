Router.configure({
	layoutTemplate: 'layout'
});

Router.route('/login', function () {
	this.layout('authentication');
	this.render('login');
});

Router.route('/register', function () {
	this.layout('authentication');
	this.render('register');
});

Router.route('/home', function () {
	this.render('home');
});