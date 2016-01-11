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

Datas = new Mongo.Collection('datas');

Sequences = new Mongo.Collection('sequences');
SequencesEncryption = new CollectionEncryption(
	Sequences,
	['dataId'],
	{
		onFinishedDocEncryption: function(doc) {
			var thisUser = Meteor.user();
			if(thisUser) {
				var medics = thisUser.medics;

				var groups = Groups.find().fetch();
				if(groups) {
					for(var i = 0, group = groups[0]; i < groups.length; i++, group = groups[i])
						for(var j = 0; j < group.medics.length; j++)
							medics.push(group.medics[j]._id);
				}
			
				for(var i = 0; i < medics.length; i++)
					Meteor.subscribe('principals', medics[i], function () {
						MessagesEncryption.shareDocWithUser(doc._id, medics[i]);
					});
			}
		}
	}
);

// TEMP
Meteor.subscribe('sequences');

Tracker.autorun(function() {
	if(Meteor.user() && Meteor.user().profile.type === "Medic" && Meteor.user().patients) {
		var patientIds = Meteor.user().patients.map(function(p) {
			return p._id;
		});
		console.log(patientIds);

		var groups = Groups.find().fetch();		
		for(var i = 0, group = groups[0]; i < groups.length; i++, group = groups[i])
			for(var j = 0; j < group.patients.length; j++)
				patientIds.push(group.patients[j]._id);

		var sequences = Sequences.find({
			userId: {
				$in: patientIds
			}
		}).fetch();

	}
	else
		var sequences = Sequences.find({userId: Meteor.userId()}).fetch();
		
	var ids = sequences.map(function(encrypted) {
			var clear = Sequences.findOne({_id: encrypted._id});
			return clear.dataId;
		});
	console.log("check");
	Meteor.subscribe('datas', ids);
});
