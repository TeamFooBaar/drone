
var bebop = require("node-bebop"),
    JSFtp = require('jsftp');

var drone = bebop.createClient(),
	ipfs_picture_name;

var ftp = new JSFtp({
  host: "192.168.42.1"
});

drone.connect(function() {
	console.log('Connected');

	setTimeout(function() {
  		p = drone.takePicture();
	}, 500);

	setTimeout(function() {
		console.log(ipfs_picture_name)
	}, 2000)
});

drone.on('PictureEventChanged', function(e) {
	if (e.error != 'ok')
		return;

	ftp.ls("internal_000/Bebop_2/media", function(err, res) {
		filename = get_last_file(res).name;

		ftp.get('internal_000/Bebop_2/media/' + filename, 
			    'images/' + filename, 
			    function(hadErr) {
		    if (hadErr)
		      	console.error('There was an error retrieving the file.');
		    else
		      	console.log('File copied successfully!');
	  	});

	  	ipfs_picture_name = filename;
	    console.log(ipfs_picture_name)
	});
});

get_last_file = function(file_array) {
	return file_array.sort((f1, f2) => f1.name.localeCompare(f2.name)).slice(-1)[0];
}