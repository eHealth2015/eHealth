Datas = new Mongo.Collection('datas');

Meteor.publish('getListSequence', function(userId) {
	if(this.userId)
		return Meteor.users.find({_id: userId}, {
			fields: {
				'sequences': 1
			}
		});
	else
		this.ready();
});

Meteor.publish('getDatas', function(userId, sequenceIds) {
	if(this.userId)
		Datas.find({ _id: {
			$in: sequenceIds
		}});
	else
		this.ready();
});