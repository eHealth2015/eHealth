if(Meteor.isCordova) {
	fingerprint = {
		samsung: false,
		apple: false
	};

	SamsungPass.checkForRegisteredFingers(function() {
		fingerprint.samsung = true;
		fingerprint.check = function(a, b) {
			SamsungPass.startIdentifyWithDialog(a, b);
		};
	}, function() {
		fingerprint.samsung = false;
	});

	window.plugins.touchid.isAvailable(function(msg) {
		fingerprint.apple = true;
		fingerprint.check = function(a, b) {
			window.plugins.touchid.verifyFingerprintWithCustomPasswordFallback(
				'Please scan your fingerprint',
				a,
				b
			);
		};
	}, function(msg) {
		fingerprint.apple = false;
	});
}