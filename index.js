var bebop = require("node-bebop"),
    JSFtp = require('jsftp')
    //cv = require("opencv");

var drone = bebop.createClient()

var ftp = new JSFtp({
  host: "192.168.42.1"
});

drone.connect(function() {
	console.log('Connected');
	
	var today = new Date().toISOString();
  	drone.Common.currentDate(today);
	drone.Common.currentTime(today);
	console.log('Time updated:', today)
});

drone.startMission = function() {
	console.log("startMission!")


	//TODO INSTRUCTIONS
	setTimeout(function() {
  		drone.takePicture();
	}, 500);
}

drone.on('PictureEventChanged', handlePictureEventChanged)

function handlePictureEventChanged(e) {
	if (e.error !== 'ok')
		return;

	ftp.ls("internal_000/Bebop_2/media", function(err, res) {
		filename = get_last_file(res).name;

		ftp.get('internal_000/Bebop_2/media/' + filename, 
			    '../ground/images/' + filename, 
			    function(hadErr) {
		    if (hadErr)
		      	console.error('There was an error retrieving the file.');
		    else
		      	console.log('File copied successfully!');
			  	console.log('filename:', filename)
				detectPatterns(filename);
				drone.emit('endmission');
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
		});
	});
}


module.exports = drone;