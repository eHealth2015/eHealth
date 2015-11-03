Template.settings.helpers({
	'email': function() {
		return Meteor.user().emails[0];
	},
	'profile': function() {
		return Meteor.user().profile;
	}
});

Template.settings.events({
	'submit form': function(event, template) {
		event.preventDefault();		
		var code = template.find('#code').value;
		var firstName = template.find('#firstName').value;
		var lastName = template.find('#lastName').value;
		var type = template.find("#profileType").value;

		if(firstName && lastName && firstName != "" && lastName != "") {
			Meteor.users.update({_id: Meteor.userId()}, {
				$set: {"profile.type": type,
					"profile.firstName": firstName,
					"profile.lastName": lastName,
					"profile.complete": "yes"
				}
			});
		}
		else {
			// TODO TELL THAT WE NEED ALL INFORMATIONS
			console.log("NEED FIRSTNAME AND LASTNAME");
		}
	},
	'click #sendVerifEmail': function(event) {
		event.preventDefault();
		// TODO
		console.log("TODO");
	}
})

Template.settings.onRendered(function() {
	setActive("settings");
})