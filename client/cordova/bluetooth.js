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
				// TODO SHOW SUCCESS MSG WITH NAME?
				console.log("CONNECT SUCCESS");
				bluetooth.subscribe();
				bluetooth.check();
				bluetooth.send('A|'+ new Date().getTime());
			},
			function() {
				// TODO SHOW ERR MSG
				console.log("FAIL TO CONNECT");
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
		console.log("disconnect succeed");
		Session.set('bt', {connected: false, trying: false});
	}, function() {
		console.log("disconnect failed")
	});
};

bluetooth.send = function(data) {
	console.log("Message: " + data);
	bluetoothSerial.write(data+'\n', function() {
		console.log("BT write OK");
	}, function() {
		console.error("BT write error");
	});
};