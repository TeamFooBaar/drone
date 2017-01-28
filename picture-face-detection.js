
var cv = require("opencv");

var face_filename, 
	n_faces=0;

draw_faces('Bebop_2_2017-01-28T184903+0100_.jpg')

function draw_faces(filename) {
	cv.readImage('images/' + filename, function(err, im) {
		if (err) {
			console.log(err);
		} else {
			im.detectObject(cv.FACE_CASCADE, {}, function(e, faces) {
		  		if (e) {
			    	console.log(e);
		  		}
		  		for (var i = 0; i < faces.length; i++) {
			 		var x = faces[i];
				    im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
				}
				im.save('images/faces_' + filename);
				face_filename = 'images/faces_' + filename
				n_faces = faces.length
			});
		}
	});
}
