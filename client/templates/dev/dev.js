Template.dev.onRendered(function() {
	setActive("dev");
	Session.set('devices', []);
});

Template.dev.helpers({
	log: function() {
		return Session.get('log');
	},
	type: function() {
		return device.platform;
	},
	state: function() {
		return Session.get('state');
	},
	devices: function() {
		return Session.get('devices');
	}
});

Template.dev.events({
	'click .connect': function(event) {
		var addr = event.currentTarget.getAttribute("addr");
		var connect = event.currentTarget;
		var disconnect = connect.nextElementSibling;
		bluetoothSerial.connect(addr, function() {
			console.log("connect ok");
			$(connect).hide();
			$(disconnect).show();
			bluetoothSerial.subscribe('\n', function (data) {
				console.log(data);
				Session.set('log', data);
			}, function(err) {
				console.log(err);
			});
		}, function(msg) {
			console.log("fail to connect");
			console.log(msg);
			$(connect).show();
			$(disconnect).hide();
		});
	},
	'click .disconnect': function(event) {
		var addr = event.currentTarget.getAttribute("addr");
		var disconnect = event.currentTarget;
		var connect = event.currentTarget.previousElementSibling;
		bluetoothSerial.disconnect(function() {
			console.log("disconnect ok");
			$(connect).show();
			$(disconnect).hide();
		}, function(msg) {
			console.log("fail to disconnect");
			console.log(msg);
			$(connect).hide();
			$(disconnect).show();
		});
	},
	'click #isEnabled': function() {
		bluetoothSerial.isEnabled(function() {
			console.log("Bluetooth is enabled");
		}, function() {
			console.log("Bluetooth is *not* enabled");
		});
	},
	'click #enable': function() {
		bluetoothSerial.enable(function() {
			console.log("Bluetooth is enabled");
		}, function() {
			console.log("The user did *not* enable Bluetooth");
		});
	},
	'click #showSettings': function() {
		bluetoothSerial.showBluetoothSettings();
	},
	'click #list': function() {
		bluetoothSerial.list(function(devices) {
			devices.forEach(function(device) {
				console.log(device.id);
			});
		}, function(err) {
			console.log("fail list"),
			console.log(err);
		});
	},
	'click #discover': function() {
		bluetoothSerial.discoverUnpaired(function(devices) {
			devices.forEach(function(device) {
				console.log(JSON.stringify(device));
				var tab = Session.get('devices');
				tab.push(device);
				Session.set('devices', tab);
			});
		}, function(err) {
			console.log("fail list"),
			console.log(err);
		});
	},
	'click #SamsungPass1': function(event) {
		SamsungPass.startIdentifyWithDialog(Meteor.bindEnvironment(function() {
			console.log('SamsungPass Success');
			Session.set('state', 'unlocked');
		}), Meteor.bindEnvironment(function() {
			console.log('SamsungPass Failure');
			Session.set('state', 'locked');
		}));
	},
	'click #SamsungPass2': function(event) {
		SamsungPass.checkForRegisteredFingers();
	},
	'click #SamsungPass3': function(event) {
		SamsungPass.startIdentifyWithDialog();
	}
});