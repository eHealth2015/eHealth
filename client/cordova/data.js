newData = function(data) {

	/* data = ":F|timestamp|seqId|H,xx.xx|I,xx.xx;" */

	if (data.charAt(0) != ":")
		return;

	var type = data.charAt(1);
	var dataTab = data.split("|");

	switch(type) {

		case "A":
			A();
			break;

		case "E":
			E(dataTab);
			break;

		case "F":
			F(dataTab);
			break;

		case "G":
			break;

		default:
			break;

	}

	/*//data.substring() pour enlever potentiellement les ':' et le ';'
	// on considère qu'ils y sont, peut etre chercher leur position, sinon c'est le 1 et le dernier OK?
	var dataTab = data.split('|');
	var timestamp = dataTab[1];

	switch(type) {
		default:
			break;
	}*/

	function A() {
		// si A -> envoie A avec timestamp
		if (type == "A") {
			bluetooth.send(new Date().getTime());
			return;
		}
	}

	function E(dataTab) {
		var timestamp = getTimestamp(dataTab);
		var payload = getPayload(dataTab);
		var seqId = getSeqId(dataTab);

		// TODO
	}

	function F(dataTab) {
		var timestamp = getTimestamp(dataTab);
		var payload = getPayload(dataTab);
		var seqId = getSeqId(dataTab);
		var data = {
			seqId: seqId,
			sensors: []
		};

		for (var i = 0; i < payload.length; i++) {

			var unitPayload = payload[i];
			var infos = unitPayload.split(",");
			var sensor = infos[0];
			var sensorData = {
				x: timestamp,
				y: infos[1]
			};

			data.sensors.push({
				sensor: sensor,
				data: sensorData
			});
		}

		Datas.insert(data, function(error, result) {
			if (error)
				console.error(error);
			else {
				Meteor.users().update({
					_id: Meteor.userId()
				}, {
					$addToSet: {sequences: result}
				});
			}
		});
	}

	function getTimestamp(dataTab) {
		return dataTab[1];
	}

	function getSeqId(dataTab) {
		return dataTab[2];
	}

	function getPayload(dataTab) {
		return dataTab.slice(3);
	}
};

