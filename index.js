var bebop = require("node-bebop"),
    JSFtp = require('jsftp');

var drone = bebop.createClient()

var ftp = new JSFtp({
  host: "192.168.42.1"
});

drone.connect(function() {
	console.log('Connected');
});

drone.startMission = function() {
	console.log("startMission!")
	//TODO INSTRUCTIONS
	// setTimeout(function() {
 //  		p = drone.takePicture();
	// }, 500);
}

drone.on('PictureEventChanged', handlePictureEventChanged)

function handlePictureEventChanged(e) {
	if (e.error !== 'ok')
		return;

	ftp.ls("internal_000/Bebop_2/media", function(err, res) {
		filename = get_last_file(res).name;

		ftp.get('internal_000/Bebop_2/media/' + filename, 
			    '../images/' + filename, 
			    function(hadErr) {
		    if (hadErr)
		      	console.error('There was an error retrieving the file.');
		    else
		      	console.log('File copied successfully!');
	  	});

	  	drone.imageFileName = filename;
	});
}

function get_last_file(file_array) {
	return file_array.sort((f1, f2) => f1.name.localeCompare(f2.name)).slice(-1)[0];
}

module.exports = drone;