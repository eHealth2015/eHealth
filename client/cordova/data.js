newData = function(data) {

	/*  TEST DATA:
		"E|1234|1|H,21.2"
		"F|1500|1|H,39.7|J,1.09|K,99.009"
		"G|900|2|I,1"
		"F|timestamp|seqId|H,xx.xx|I,xx.xx"
	*/

	var type = data.charAt(0);
	var dataTab = data.split("|");
	var timestamp = getTimestamp(dataTab);
	var payload = getPayload(dataTab);

	switch(type) {

		case "E":
			E(dataTab);
			break;

		case "F":
			saveData(dataTab);
			break;

		case "G":
			saveData(dataTab);
			break;

		default:
			break;
	}

	function E(dataTab) {
		var seqId = getSeqId(dataTab);

		var dataDbElement = Datas.findOne({
			seqId: seqId
		});

		var alerts = payload.map(function(e) {
			return [timestamp, convertLetterToSensor(getData(e)[0])];
		})

		if(dataDbElement) {
			var tStart = timestamp < dataDbElement.tStart ? timestamp : dataDbElement.tStart;
			var tEnd = timestamp > dataDbElement.tStart ? timestamp : dataDbElement.tEnd;
			for (var i = 0; i < payload.length; i++) {
				updateData(dataDbElement._id, {
					$addToSet: {alerts: {$each: alerts}},
					$set: {
						tStart: tStart,
						tEnd: tEnd
					}
				});
			}}
		else
			insertData({
				seqId: seqId,
				tStart: timestamp,
				tEnd: timestamp,
				alerts: alerts,
				data: {}
			});
	}

	function saveData(dataTab) {
		var seqId = getSeqId(dataTab);
		
		var dataDbElement = Datas.findOne({
			seqId: seqId
		});

		if(dataDbElement) {
			var tStart = timestamp < dataDbElement.tStart ? timestamp : dataDbElement.tStart;
			var tEnd = timestamp > dataDbElement.tStart ? timestamp : dataDbElement.tEnd;

			var updateDataObj = {};
			for (var i = 0; i < payload.length; i++) {
				var detailData = getData(payload[i]);
				var propName = 'data.'+convertLetterToSensor(detailData[0]);
				updateDataObj[propName] = {x: timestamp, y: detailData[1]};
			}
			updateData(dataDbElement._id, {
				$addToSet: updateDataObj,
				$set: {
					tStart: tStart,
					tEnd: tEnd
				}
			});
		}
		else {
			var data = {};
			for (var i = 0; i < payload.length; i++) {
				var detailData = getData(payload[i]);
				data[convertLetterToSensor(detailData[0])] = [{x: timestamp, y: detailData[1]}];
			}
			insertData({
				seqId: seqId,
				tStart: timestamp,
				tEnd: timestamp,
				alerts: [],
				data: data
			});
		}
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

	function getData(dataTabElement) {
		return dataTabElement.split(',');
	}

	function insertData(doc) {
		Datas.insert(doc, function(err, id) {
			if(err) {
				console.log("ERROR INSERTING NEW DATA ELEMENT");
				console.log(doc);
				console.log(err);
			}
			else {
				addSequence(id, doc.tStart, doc.tEnd);
			}
		});

	}

	function updateData(id, doc) {
		Datas.update(id, doc);
	}

	function addSequence(id) {
		Sequences.insert({
			userId: Meteor.userId(),
			dataId: id
		});
	}

	function convertLetterToSensor(letter) {
		switch(letter) {
			case 'H':
				return 'Airflow';
			break;
			case 'I':
				return 'HeartBeats';
			break;
			case 'J':
				return 'Oxymetry';
			break;
			case 'K':
				return 'Temperature';
			break;
			case 'L':
				return 'Conductance';
			break;
		}
	}
};