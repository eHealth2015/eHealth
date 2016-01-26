var dataLoaded = [];
var realTimeData = false;
var intervalId = [];
var generateChartFirstTime = true;
var dataToDisplay = [];
var nbAlerts = null;

Template.data.onRendered(function() {
	setActive("data");
});

Template.data.onDestroyed(function() {
	if(Meteor.isCordova) {
		bluetooth.send('D');
	}
	stopIntervals();
});

Template.data.events({
	'click #connect': function(event) {
		if(Session.get('bt').connected)
			bluetooth.disconnect();
		else
			bluetooth.try2connect();
	},
	'click #realTimeData': function(event) {
		if(Meteor.isCordova) {
			bluetooth.send('B');
			realTimeData = true;
			$(event.currentTarget).hide();
			$("#stop").show();

			if (isUserPatient()) {
				var lastSequence = Datas.find({}, {sort: {tEnd: -1}, limit: 1}).fetch().pop();
				if (lastSequence) {
					var lastSequenceId = lastSequence._id;
					Router.go('/data/' + Meteor.userId() + '/' + lastSequenceId);
					intervalId.push(Meteor.setInterval(function() {
						dataLoaded = getSequence(lastSequenceId);
						var hashId = Session.get('hashId');
						console.log(hashId);
						var id = hashId ? hashId : 0;
						dataToDisplay = dataLoaded[id];
						generateChart("#chart-container", dataToDisplay);
					}, 500));
				}
			}
		}
	},
	'click #SD': function(event) {
		if(Meteor.isCordova) {
			bluetooth.send('C');
		}
	},
	'click #stop': function(event) {
		realTimeData = false;
		if(Meteor.isCordova) {
			bluetooth.send('D');
		}
		$(event.currentTarget).hide();
		$("#realTimeData").show();
		stopIntervals();
	},
	'click .sensor': function(event) {
		var hash = event.currentTarget.getAttribute("href");
		var id = parseInt(hash.replace("#", ""));
		Session.set('hashId', id);
		dataToDisplay = dataLoaded[id];
		generateChart("#chart-container", dataToDisplay);
	}
})

Template.data.helpers({
	btTrying: function() {
		return Session.get('bt').trying ? "loading" : "";
	},
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
				newMsg("error", 'Error: patient not found');
			}

			if(!dataId)
				return {
					links: links,
					active: firstName+" "+lastName
				};
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
					newMsg("error", 'Error: sequence not found');
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

			} else if (!sequenceId)
				return getMySequences();
			else {
				dataLoaded = getSequence(sequenceId);
				if (generateChartFirstTime && realTimeData) {
					dataToDisplay = dataLoaded[0];
					generateChart("#chart-container", dataToDisplay);
				}
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
		var ids = Meteor.user().patients;
		var groups = Groups.find().fetch();
		for(i = 0; i < groups.length; i++)
			for(var j = 0; j < groups[i].patients.length; j++)
				ids.push(groups[i].patients[j]._id);
		
		return ids.map(function(patient) {
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
		var alerts = sequence.alerts.length;
		if(nbAlerts && alerts > nbAlerts) {
			var lastElement = sequence.alerts[alerts-1];
			newMsg("warning", "Alert: "+lastElement[0]+" with value "+lastElement[1]+"(seqId "+sequence.seqId+")");
		}
		
		nbAlerts = alerts;

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

function generateChart(id, object) {
	generateChartFirstTime = false;

	$(id).highcharts('StockChart', {
		chart: {
			backgroundColor: "#eee",
			plotBackgroundColor: "#f5f5f5"
		},
		plotOptions: {
			series: {
				animation: !realTimeData
			}
		},
		rangeSelector: {
			enabled: true,
			buttons: [{
				type: 'second',
				count: 10,
				text: '10s'
			}, {
				type: 'second',
				count: 30,
				text: '30s'
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
			type: 'spline',
			data: object.data
		}]
	});

	$("text:contains('Highcharts.com')").remove();
}

function stopIntervals() {
	for (var i in intervalId) {
		Meteor.clearInterval(intervalId[i]);
	}
}