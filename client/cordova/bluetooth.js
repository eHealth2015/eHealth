if(Meteor.isCordova) {
	ARDUINO_BLUETOOTH_MAC_ADDR = "20:13:12:12:90:3A";

	Session.setDefault('bt', {connected: false, trying: false});

	bluetooth = {
		fail2connect: 0,
	};

	bluetooth.try2connect = function() {
		console.log("start try to connect");
		if(!Session.get('bt').trying) {
			console.log("realy start try to connect");
			Session.set('bt', {connected: false, trying: true});
			bluetoothSerial.connect(
				ARDUINO_BLUETOOTH_MAC_ADDR,
				function() {
					bluetooth.subscribe();
					bluetooth.check();
					newMsg("success", "Connected to Arduino.");
					bluetooth.send('A|'+ new Date().getTime());
				},
				function() {
					console.log("Error: fail to connect");
					if(++bluetooth.fail2connect < 2)
						Meteor.setTimeout(function() {
							Session.set('bt', {connected: false, trying: false});
							bluetooth.try2connect();
						}, 1000);
					else {
						bluetooth.fail2connect = 0;
						Session.set('bt', {connected: false, trying: false});
					}
				}
			);
		}
	};

	bluetooth.subscribe = function() {
		bluetoothSerial.subscribe('\n', function (rawdata) {
			var data = rawdata.substr(0, rawdata.length-1);
			console.log("New message from bluetooth: "+data);
			newData(data);
		}, function() {
			newMsg("error", "Error data from bluetooth");
		});
	};

	bluetooth.check = function() {
		this.handleCheck = Meteor.setInterval(function() {
			bluetoothSerial.isConnected(function() {
				if(!Session.get('bt').connected)
					Session.set('bt', {connected: true, trying: false});
			}, function() {
				if(Session.get('bt').connected)
					Session.set('bt', {connected: false, trying: false});
				Meteor.clearInterval(bluetooth.handleCheck);
			});
		}, 1000)
	};

	bluetooth.disconnect = function() {
		if(this.handleCheck)
			Meteor.clearInterval(this.handleCheck);

		bluetoothSerial.disconnect(function() {
			newMsg('success', 'Disconnected from Arduino.');
			Session.set('bt', {connected: false, trying: false});
		}, function() {
			newMsg('error', 'Error: disconnection failed.')
		});
	};

	bluetooth.send = function(data) {
		console.log("Message: " + data);
		bluetoothSerial.write(data+'\n', function() {
			console.log("BT write OK");
		}, function() {
			newMsg("error", "BT write error");
		});
	};
}