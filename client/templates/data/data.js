var dataLoaded = [];
Template.data.onRendered(function() {
	setActive("data");
});

Template.data.events({
	'click #connect': function(event) {
		if(Session.get('bt').connected)
			bluetooth.disconnect();
		else
			bluetooth.try2connect();
	},
	'click #realTimeData': function(event) {
		bluetooth.send('B');
	},
	'click #SD': function(event) {
		bluetooth.send('C');
	},
	'click #stop': function(event) {
		bluetooth.send('D');
	},
	'click .sensor': function(event) {
		var hash = event.currentTarget.getAttribute("href");
		var id = parseInt(hash.replace("#", ""));
		generateChart("#chart-container", dataLoaded[id]);
	}
})

Template.data.helpers({
	btConnection: function() {
		if(!Session.get('bt').connected)
			return {
				text: "Connect",
				class: "disabled"
			};	
		else
			return {
				text: "Disconnect",
				class: ""
			};
	},
	breadcrumb: function() {
		var patientId = Router.current().params.patientId;
		var dataId = Router.current().params.sequenceId;
		
		if(!patientId && !dataId)
			return {
				links: [],
				active: "Data"
			};
		else if(patientId) {
			var links = [{label: "Data", link: "/data"}];
			var patient = Meteor.users.findOne({_id: patientId});
			if(patient) {
				var firstName = patient.profile.firstName;
				var lastName = patient.profile.lastName;
			}
			else {
				Router.go('/data');
				// TODO SHOW ERROR
			}

			if(!dataId)
				return {
					links: links,
					active: firstName+" "+lastName
				}
			else {
				var data = Datas.findOne({_id: dataId});
				if(data) {
					links.push({label: firstName+" "+lastName, link: '/data/'+patientId});
					return {
						links: links,
						active: "Sequence "+data.seqId
					}
				}
				else {
					Router.go('/data/'+patientId);
					// TODO SHOW ERROR
				}
			}
		}
	},
	collection: function() {
		var patientId = Router.current().params.patientId;
		var sequenceId = Router.current().params.sequenceId;
		if (isUserMedic()) {
			var patients = getPatientsForMedic();

			if (patientId && sequenceId) {
				dataLoaded = getSequence(sequenceId);
				return dataLoaded;
			} else if (patientId) {
				var patient = findById(patients, patientId);
				if (patient) {
					return getSequencesByPatientId(patient);
				}
			} else {
				return patients;
			}
		} else if (isUserPatient()) {
			if (!patientId && !sequenceId) {
				var events = {
					load: function() {
						var series = this.series[0];
						setInterval(function() {
							// TODO
						}, 1000);
					}
				};
			} else if (!sequenceId)
				return getMySequences();
			else {
				dataLoaded = getSequence(sequenceId);
				return dataLoaded;
			}
		}
		return {};
	},
	settingsTable: function() {
		var patientId = Router.current().params.patientId;
		var sequenceId = Router.current().params.sequenceId;

		if (isUserMedic()) {
			if (patientId && sequenceId) {
				return generateTableForSequence(sequenceId);
			} else if (patientId) {
				return generateTableForPatient(patientId);
			} else {
				return generateTableForPatients();
			}
		} else if (isUserPatient()) {
			if (!sequenceId)
				return generateTableForPatient(patientId);
			else
				return generateTableForSequence(sequenceId);
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
	var dataIds = Sequences.find({
		userId: patient._id
	}).fetch().map(function(e) {
		return Sequences.findOne({_id: e._id}).dataId;
	});
	return Datas.find({_id: {
		$in: dataIds
	}});
}

function getSequence(sequenceId) {
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
			{ key: '_id', label: 'Sequences', fn: function(patientId) {
				return Sequences.find({userId: patientId}).count();
			}},
			{ key: '_id', label: 'Alerts', fn: function(patientId) {
				return getNbAlertsById(patientId);
			}},
			{ key: '_id', label: '', fn: function(value) {
				return new Spacebars.SafeString('<a class="compact ui teal button" href="/data/' + value + '">Show sequences</a>');
			}}
		]
	};
}

function getNbAlertsById(patientId) {
	var dataIds = Sequences.find({userId: patientId}).fetch().map(function(sequence) {
		return Sequences.findOne({_id: sequence._id}).dataId;
	});
	var nb = 0;
	Datas.find({_id: {
		$in: dataIds
	}}).fetch().map(function(data) {
		nb += data.alerts.length;
	});
	return nb;
}

function generateTableForPatient(userId) {
	return {
		showFilter: true,
		fields: [
			{ key: 'seqId', label: 'Sequences', fn: function(value) {
				return "Sequence "+value;
			}},
			{ key: 'data', label: 'List of sensors', fn: function(value) {
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
			{ key: 'tEnd', label: 'End time', fn: function(value) {
				var date = new Date(parseInt(value));
				var format = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " - " + date.getHours() + ":" + date.getMinutes();
				return format;
			}},
			{ key: 'alerts', label: 'Alerts', fn: function(value) {
				return value.length;
			}},
			{ key: '_id', label: '', fn: function(value) {
				return new Spacebars.SafeString('<a class="compact ui teal button" href="/data/' + userId + '/' + value + '">Show</a>');
			}}
		]
	};
}

function generateTableForSequence(sequenceId) {
	var data = Datas.findOne({_id: sequenceId});
	return {
		showFilter: true,
		fields: [
			{ key: 'name', label: 'Sensor' },
			{ key: 'name', label: 'Alerts', fn: function(value) {
				return data.alerts.filter(function(e) {
					if(e[1] === value) return true;
				}).length;
			}},
			{ key: 'id', label: '', fn: function(value) {
				return new Spacebars.SafeString('<a class="sensor compact ui teal button" href="#' + value + '">View</a>');
			}}
		]
	};
}

function generateChart(id, object, eventParam) {
	var events = (eventParam) ? eventParam : null;

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
		events: events,
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