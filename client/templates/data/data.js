var dataLoaded = [];
Template.data.onRendered(function() {
	setActive("data");
	var userId = Router.current().params.userId;
	var sequenceId = Router.current().params.sequenceId;

	/*if (userId && sequenceId) {
		// TODO
		// var sequence = getSequenceBySequenceId(sequenceId);
		var data = [
			{x: 1, y: 0.001},
			{x: 2, y: -0.446}
		];
		generateChart("#chart-container", data);
	}*/
});

Template.data.events({
	'click .sensor': function(event) {
		var hash = event.currentTarget.getAttribute("href");
		var id = parseInt(hash.replace("#", ""));
		generateChart("#chart-container", dataLoaded[id]);
	}
})

Template.data.helpers({
	collection: function() {
		var userId = Router.current().params.userId;
		var sequenceId = Router.current().params.sequenceId;
		if (isUserMedic()) {
			var patients = getPatientsForMedic();

			if (userId && sequenceId) {
				// nothing to do I think
			} else if (userId) {
				var patient = findById(patients, userId);
				if (patient) {
					return getSequencesByPatientId(patient);
				}
			} else {
				return patients;
			}
		} else if (isUserPatient()) {
			if (!sequenceId)
				return getMySequences();
			else {
				dataLoaded = getMySequence(sequenceId);
				return dataLoaded;
			}
		}
		return {};
	},
	settingsTable: function() {
		var userId = Router.current().params.userId;
		var sequenceId = Router.current().params.sequenceId;

		if (isUserMedic()) {

			if (userId && sequenceId) {
				return generateTableForSequence();
			} else if (userId) {
				return generateTableForPatient();
			} else {
				return generateTableForPatients();
			}
		} else if (isUserPatient()) {
			if (!sequenceId)
				return generateTableForPatient();
			else
				return generateTableForSequence();
		}
		return {};
	}
});

// MEDIC PART
function getPatientsForMedic() {
	if(isUserMedic()) {
		return Meteor.user().patients.map(function(patient) {
			var user = Meteor.users.findOne({_id: patient._id});
			if(user) {
				patient.firstName = user.profile.firstName;
				patient.lastName = user.profile.lastName;
				patient.gender = user.profile.gender;
			}
			return patient;
		});
	}
	return [];
}

function getSequencesByPatientId(patient) {
	//Meteor.subscribe("sequences");
	return Sequences.findOne({
		// TODO
	}).fetch();
}

function getMySequence(sequenceId) {
	var sequence = Datas.findOne({_id: sequenceId});
	var sensors = [];
	if (sequence) {
		var data = sequence.data;
		var id = 0;
		for (var key in data) {
			var sensorData = {};
			sensorData.name = key;
			sensorData.id = id;
			sensorData.data = data[key];
			sensors.push(sensorData);
			id++;
		}
	}
	return sensors;
}

function getSequenceBySequenceId(sequenceId) {
	// TODO
}

function findById(array, id) {
	for (var i = 0; i < array.length; i++) {
		if (array[i]._id == id) {
			return array[i];
		}
	}

	return null;
}

// Patient Part
function getMySequences() {
	return Datas.find().fetch();
}

// Visual Part
function generateTableForPatients() {
	return {
		showFilter: true,
		fields: [
			{ key: 'firstName', label: 'First Name' },
			{ key: 'lastName', label: 'Last Name' },
			{ key: 'gender', label: 'Gender' },
			{ key: '_id', label: '', fn: function(value) {
				return new Spacebars.SafeString('<a class="compact ui teal button" href="/data/' + value + '">Sequences</a>');
			}}
		]
	};
}

function generateTableForPatient() {
	return {
		showFilter: true,
		fields: [
			{ key: 'data', label: 'List of data', fn: function(value) {
				var keys = "";
				for (var key in value) {
					if (keys != "")
						keys += ", ";
					keys += key;
				}
				return keys;
			}
			},
			{ key: 'tStart', label: 'Start time', fn: function(value) {
				var date = new Date(parseInt(value));
				var format = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " - " + date.getHours() + ":" + date.getMinutes();
				return format;
			}
			},
			{ key: '_id', label: '', fn: function(value) {
				return new Spacebars.SafeString('<a class="compact ui teal button" href="/data/' + Meteor.userId() + '/' + value + '">Details</a>');
			}}
		]
	};
}

function generateTableForSequence() {
	return {
		showFilter: true,
		fields: [
			{ key: 'name', label: 'Sensor' },
			{ key: 'id', label: '', fn: function(value) {
				return new Spacebars.SafeString('<a class="sensor compact ui teal button" href="#' + value + '">View</a>');
			}}
		]
	};
}

function generateChart(id, object) {
	$(id).highcharts('StockChart', {
		chart: {
			backgroundColor: "#eee",
			plotBackgroundColor: "#f5f5f5"
		},
		rangeSelector: {
			enabled: true,
			buttons: [{
				type: 'millisecond',
				count: 100,
				text: '0.1s'
			}, {
				type: 'second',
				count: 1,
				text: '1s'
			}, {
				type: 'all',
				text: 'All'
			}],
			selected: 0
		},
		title: {
			text: object.name
		},
		xAxis: {
			type: 'datetime',
			tickPixelInterval: 1000
		},
		yAxis: {
			title: {
				text: 'Value'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		legend: {
			enabled: false
		},
		exporting: {
			enabled: false
		},
		series: [{
			name: 'Random data',
			turboThreshold: 5000,
			data: object.data
		}]
	});

	$("text:contains('Highcharts.com')").remove();
}