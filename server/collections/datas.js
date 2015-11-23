Datas = new Mongo.Collection('datas');

Meteor.publish('getListSequence', function(userId) {
	if(this.userId)
		return Meteor.users.find({_id: userId});
			// fields: {

			// }
		
	else
		this.ready();
});

Meteor.publish('getDatas', function(userId, sequenceId) {
	if(this.userId)
		return getGroupsByUserId(this.userId);
	else
		this.ready();
});