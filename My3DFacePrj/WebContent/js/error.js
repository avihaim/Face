
function getErrorCode() {
	var urlQuery = location.search;
	urlQuery = urlQuery.replace('?', '');
	var split = urlQuery.split('=');

	return split[1];
}

$(document)
		.ready(
				
				function() {
					var errorCode = getErrorCode();
					
					switch (errorCode) {
					   case 'imgaeNotFound':
					      $('#errorMsg').append('The system can not found the requestd');
					      break;
					   case 'badFileType':
						  $('#errorMsg').append('The requestd file type is not a supported image');
						  break;
					   case 'faceNotFound':
					      $('#errorMsg').append('The face in the image can not be found');
					      break;
					   case 'general':
					      $('#errorMsg').append('Sory, but we can not complete the operation at the moment');
					      break;
					   default:
						   $('#errorMsg').append('Sory, but we can not complete the operation at the moment');
					      break;
					}

					
				}
				);