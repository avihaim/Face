function getErrorCode() {
	var urlQuery = location.search;
	urlQuery = urlQuery.replace('?', '');
	var split = urlQuery.split('=');

	return split[1];
}

$(document)
		.ready(
				
				function() {
					var msgText = '';
					var errorCode = getErrorCode();
					var errorMsgArea = $('#errorMsg');

					switch (errorCode) {
					case 'imgaeNotFound':
						msgText = 'The system cannot find the requested image';
						break;
						
					case 'badFileType':
						msgText = 'The requested file type is not a supported image extention';
						break;
						
					case 'faceNotFound':
						msgText = 'The face in the image be recognized';
						break;
						
					case 'threeDaFaceError':
						msgText = 'Some error occurred, perhaps the image is not ThreeDaFaceable ';
						break;
						
					case 'general':
						msgText = 'Sorry, but we cannot complete the operation at the moment';
						break;
						
					default:
						msgText = 'Sorry, but we cannot complete the operation at the moment';
						break;
					}
					
					// set the text message to the div.
					errorMsgArea.text(msgText);
				});