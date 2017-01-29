var bebop = require("node-bebop"),
    JSFtp = require('jsftp')
    cv = require("opencv");

var drone = bebop.createClient()

var ftp = new JSFtp({
  host: "192.168.42.1"
});


/*var today = new Date().toISOString();
	drone.Common.currentDate(today);
drone.Common.currentTime(today);
console.log('Time updated:', today)*/

drone.startMission = function(destination) {
	drone.connect(function() {
		console.log('Connected');

		console.log("startMission to destination :", destination)

		switch (destination) {
			case '0x00B8F3cdAE98CF7FA979Cc89D410a0B5f792A103'.toLowerCase(): {
				setTimeout(function() {
			  		drone.takePicture();
				}, 500);
				break;
			}

			case '0x0086DA4ebe8a66641Db49Bf25c1aB0B19F40C3EF'.toLowerCase(): {
			  	drone.takeoff();

				setTimeout(function() {
			  		drone.takePicture();
				}, 3000);

				setTimeout(function() {
					drone.land();
				}, 4000);
				break;
			}
			
			default: {
				console.log("Unknown destination");
			}
		}
	});
}

drone.on('PictureEventChanged', handlePictureEventChanged)

function handlePictureEventChanged(e) {
	if (e.error !== 'ok') {
		console.log(e);
		return;
	}

	ftp.ls("internal_000/Bebop_2/media", function(err, res) {
		fileName = get_last_file(res).name;

		ftp.get('internal_000/Bebop_2/media/' + fileName, 
			    '../ground/images/' + fileName, 
			    function(hadErr) {
		    if (hadErr)
		      	console.error('There was an error retrieving the file.');
		    else
		      	console.log('File copied successfully!');
			  	console.log('filename:', fileName)
				detectPatterns(fileName);
	  	});
	});
}

function get_last_file(file_array) {
	return file_array.sort((f1, f2) => f1.name.localeCompare(f2.name)).slice(-1)[0];
}


function detectPatterns(fileName) {
	cv.readImage('../ground/images/' + fileName, function(err, im) {
		if (err) {
			console.log('readImage')
			console.log(err);
			return;
		}
		im.detectObject(cv.FACE_CASCADE, {}, function(e, detectedPatterns) {
	  		if (e) {
				console.log('detectObject')
		    	console.log(e);
		    	return;
	  		}
	  		console.log(detectedPatterns)
	  		for (var i = 0; i < detectedPatterns.length; i++) {
		 		var x = detectedPatterns[i];
			    im.ellipse(x.x + x.width * 0.5, x.y + x.height * 0.4, x.width * 0.5, x.height * 0.7, [100, 200, 50], 4);
			}
			im.save('../ground/images/pattern_' + fileName);
			drone.imageFileName = 'pattern_' + fileName
			drone.nDetectedPatterns = detectedPatterns.length
			drone.emit('endMission');
		});
	});
}


module.exports = drone;