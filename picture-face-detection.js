
var cv = require("opencv");

var imageFileName, 
	nFaces=0;

drawFaces('Bebop_2_2017-01-28T184903+0100_.jpg')

function drawFaces(fileName) {
	cv.readImage('images/' + fileName, function(err, im) {
		if (err) {
			console.log(err);
		} else {
			im.detectObject(cv.FACE_CASCADE, {}, function(e, faces) {
		  		if (e) {
			    	console.log(e);
		  		}
		  		for (var i = 0; i < faces.length; i++) {
			 		var x = faces[i];
				    //im.ellipse(x.x + x.width * 0.5, x.y + x.height * 0.5, x.width * 0.5, x.height * 0.5);
				    im.ellipse(x.x + x.width * 0.5, x.y + x.height * 0.4, x.width * 0.5, x.height * 0.7);
				}
				im.save('images/faces_' + fileName);
				imageFileName = 'images/faces_' + fileName
				nFaces = faces.length
			});
		}
	});
}
