Datas = new Mongo.Collection('datas');

Meteor.publish('datas', function(ids) {
	if(this.userId && ids && ids != [])
		return Datas.find({
			_id: {
				$in: ids
			}
		});
	else
		this.ready();
});

Datas.allow({
	insert: function(userId, doc) {
		return (userId != null);
	},
	update: function(userId, doc, fields, modifier) {
		return true;
	},
	remove: function(userId, doc) {
		return true;
	}
});