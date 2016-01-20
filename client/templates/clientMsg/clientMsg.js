Session.set('msg', "");
var isShow = false;
var id = 0;

function futur(i) {
	console.log("i: "+i);
	Meteor.setTimeout(function() {
		console.log("i: "+i+" id: "+id);
		if(isShow && i == id) {
			$('#msg').transition('fade down');
			isShow = false;
		}
	}, 3000);
}

newMsg = function(type, newMsg) {
	Session.set('msg', newMsg);
	Session.set('msgType', type);
	id++;
	console.log("id: "+id);
	if(!isShow) {
		$('#msg').transition('fade down');
		isShow = true;
	}
	futur(id);
}

Template.clientMsg.events({
	'click .close': function() {
		if(isShow) {
			$('#msg').transition('fade down');
			isShow = false;
		}
	}
});

Template.clientMsg.helpers({
	text: function() {
		return Session.get('msg');
	},
	type: function() {
		switch(Session.get('msgType')) {
			case "error":
				return "negative";
			case "success":
				return "sucess";
			default:
				return "";
		}
	}
});