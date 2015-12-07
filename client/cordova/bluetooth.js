ARDUINO_BLUETOOTH_MAC_ADDR

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
			"48:C1:AC:F9:4A:93",
			function() {
				// TODO SHOW SUCCESS MSG WITH NAME?
				console.log("CONNECT SUCCESS");
				bluetooth.subscribe();
				bluetooth.check();
			},
			function() {
				// TODO SHOW ERR MSG
				console.log("FAIL TO CONNECT");
				if(++bluetooth.fail2connect < 10)
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
	bluetoothSerial.subscribe(';', function (data) {
		console.log(data);
		// TODO SOMETHING WITH DATA
		newData(data);
	}, function() {
		console.log("ERROR DATA IN SUBCRIBE");
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
		console.log("disconnect succed");
		Session.set('bt', {connected: false, trying: false});
	}, function() {
		console.log("disconnect failed")
	});
};

bluetooth.send = function(data) {
	bluetoothSerial.write(data, function() {
		console.log("BT write OK");
	}, function() {
		console.error("BT write error");
	});
};