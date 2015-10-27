Meteor.onConnection(function(connection) {
	logger.info("New connection from "+connection.clientAddress);
});

Accounts.onLogin(function(info) {
	logger.info("New logged user "+ info.user.emails[0].address +" ["+info.connection.clientAddress+"]");
});