function fancyboxHrefItem(href,item) {
	
	 window.parent.$(item).fancybox({
		'padding'		: 0,
		'autoScale'		: false,
		'speedIn' 		: 200,
		'speedOut' 		: 200,
		'transitionIn'	: 'elastic',
		'transitionOut'	: 'elastic',
//		'title'			: this.title,
		'width'		    : 1000,
		'height'		: 650,
		'href'			: href,
		'type'			: 'iframe'
		
	});

}

$(function() {
	
	var width = 320, height = 240;
	
	$('#shootButton').click(function(){
		togglePanel();
	});
	
	$('#cancelButton').click(function(){
		togglePanel();
	});
	
	$('#uploadButton').click(function(){

		var dataUrl =  canvas.toDataURL("image/png");
		
//		fancyboxHrefItem('myFaceShow.html?fileName=a1.jpg','a#webCamImage');
//		window.parent.$("a#webCamImage").trigger('click');
		
		
		$.ajax({
			type: "post",
			url : "UploadImage",
			dataType :'text',
			async : false,
			data : dataUrl,
			success : opennew,
			error : function(jqXHR, textStatus,
					errorThrown) {
				alert(textStatus);
			}
			});
		
		
	});
	
	 function opennew( data ) {
			fancyboxHrefItem('myFaceShow.html?fileName=' +  data,'a#webCamImage');
			window.parent.$("a#webCamImage").trigger('click');
	 }
	 
	var pos = 0, ctx = null, saveCB, image = [];

	var canvas = document.getElementById("canvas");

	if (canvas.toDataURL) {

		ctx = canvas.getContext("2d");

		image = ctx.getImageData(0, 0, width, height);

		saveCB = function(data) {
			
			var col = data.split(";");
			var img = image;

			for ( var i = 0; i < width; i++) {
				var tmp = parseInt(col[i]);
				img.data[pos + 0] = (tmp >> 16) & 0xff;
				img.data[pos + 1] = (tmp >> 8) & 0xff;
				img.data[pos + 2] = tmp & 0xff;
				img.data[pos + 3] = 0xff;
				pos += 4;
			}

			if (pos >= 4 * width * height) {
				
				ctx.putImageData(img, 0, 0);
				
				
				pos=0;
			}
		};

	} else {

		saveCB = function(data) {
			image.push(data);

			pos += 4 * width;

			if (pos >= 4 * width * height) {
				$.post("UploadImage", {
					type : "pixel",
					image : image.join('|')
				});
				pos = 0;
			}
		};
	}

	$("#webcam").webcam({

		width : width,
		height : height,
		mode : "callback",
		swffile : "js/infusion-jQuery-webcam/jscam_canvas_only.swf",

		onSave : saveCB,

		onCapture : function() {
		//	webcam.save();
		},

		debug : function(type, string) {
			console.log(type + ": " + string);
		},
		
		onTick: function(remain) {

		    if (0 == remain) {
		        jQuery("#status").text("Cheese!");
		    } else {
		        jQuery("#status").text(remain + " seconds remaining...");
		    }
		},
		onCapture: function () {
			webcam.save();

			jQuery("#flash").css("display", "block");
			jQuery("#flash").fadeOut(100, function () {
				jQuery("#flash").css("opacity", 1);
			});
		}
		
	});
	
	
	
	function getPageSize() {

		var xScroll, yScroll;

		if (window.innerHeight && window.scrollMaxY) {
			xScroll = window.innerWidth + window.scrollMaxX;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}

		var windowWidth =0 , windowHeight =0;

		if (self.innerHeight) { // all except Explorer
			if(document.documentElement.clientWidth){
				windowWidth = document.documentElement.clientWidth;
			} else {
				windowWidth = self.innerWidth;
			}
			windowHeight = self.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) { // other Explorers
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}

		// for small pages with total height less then height of the viewport
		if(yScroll < windowHeight){
			pageHeight = windowHeight;
		} else {
			pageHeight = yScroll;
		}

		// for small pages with total width less then width of the viewport
		if(xScroll < windowWidth){
			pageWidth = xScroll;
		} else {
			pageWidth = windowWidth;
		}

		return [pageWidth, pageHeight];
	}
	window.addEventListener("load", function() {

		jQuery("body").append("<div id=\"flash\"></div>");

		var canvas = document.getElementById("canvas");

		if (canvas.getContext) {
			ctx = document.getElementById("canvas").getContext("2d");
			ctx.clearRect(0, 0, width, height);

			image = ctx.getImageData(0, 0, width, height);
		}
		
		var pageSize = getPageSize();
		jQuery("#flash").css({ height: pageSize[1] + "px" });

	}, false);
	

	window.addEventListener("resize", function() {

		var pageSize = getPageSize();
		jQuery("#flash").css({ height: pageSize[1] + "px" });

	}, false);

});

function togglePanel(){
	var visible = $('.visible');
	var hidden = $('.hidden');
	
	visible.fadeOut('fast',function(){
		hidden.show();
	});
	
	visible.removeClass('visible');
	hidden.removeClass('hidden');
	
	visible.addClass('hidden');
	hidden.addClass('visible');
	
	
}
