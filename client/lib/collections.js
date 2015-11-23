Groups = new Mongo.Collection('groups');

Messages = new Mongo.Collection('messages');

MessagesEncryption = new CollectionEncryption(
	Messages,
	['message'],
	{
		onFinishedDocEncryption: function(doc) {
			Meteor.subscribe('principals', doc.receiver, function () {
				MessagesEncryption.shareDocWithUser(doc._id, doc.receiver);
			});
		}
	}
);