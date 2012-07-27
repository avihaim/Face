$(document)
		.ready(
				function() {

					var mouseX = 0, mouseY = 0;
					var mouseRightX = 0, mouseRightY = 0;
					var startX = 0;
					var startY = 0;
					var startZ = 0;
					var mouseDelta = 0;
					var isClick = false;
					var isRightClick = false;
				
					var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
						 
					if (document.attachEvent) //if IE (and Opera depending on user setting)
					    document.attachEvent("on"+mousewheelevt,onMousewheel);
					else if (document.addEventListener) //WC3 browsers
					    document.addEventListener(mousewheelevt,onMousewheel, false);
					
					document.addEventListener('mousedown',
							onDocumentMouseDown); 
					
					document.addEventListener('mouseup',
							onDocumentMouseUp);
					
					document.addEventListener('mousemove',
							onDocumentMouseMove, false);
					
					document.addEventListener('onContextMenu',
							onContextMenuEvet, false); 
						

					var SCREEN_WIDTH = window.innerWidth;
					var SCREEN_HEIGHT = window.innerHeight;

					var windowHalfX = window.innerWidth / 2;
					var windowHalfY =  window.innerHeight / 2;

					if (!Detector.webgl) {

						Detector.addGetWebGLMessage();
						document.getElementById('container').innerHTML = "";

					}

					var container, stats;

					var camera, controls, scene, renderer;

					var mesh, texture;

					var worldWidth = 6000, worldDepth = 6000, worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

					var clock = new THREE.Clock();

					init();
					animate();

					function init() {
						// touch();
						// Setup the ajax indicator
						$('body')
								.append(
										'<div id="ajaxBusy"><p><img src="images/ajax-loader.gif"></p></div>');

						$('#ajaxBusy').css({
							display : "none",
							margin : "0px",
							paddingLeft : "0px",
							paddingRight : "0px",
							paddingTop : "0px",
							paddingBottom : "0px",
							position : "absolute",
							right : "50%",
							top : "50%",
							width : "auto"
						});

						$('#ajaxBusy').show();

						container = document.getElementById('container');

						scene = new THREE.Scene();

						// camera = new THREE.PerspectiveCamera( 0, 0, 0, 0 );
						camera = new THREE.PerspectiveCamera(63,
								window.innerWidth / window.innerHeight, 1,
								20000);
						scene.add(camera);

						controls = new THREE.PathControls(camera);
//						controls.movementSpeed = 1000;
//						controls.lookSpeed = 0.1;

						var faceData;

						var urlQuery = location.search;
						urlQuery = urlQuery.replace('?', '');
						var split = urlQuery.split('=');

						var fileName = split[1];
						var dataString = "fileName=" + fileName;

						$
								.ajax({
									url : "ImageRGBServlet",
									data : dataString,
									dataType : "json",
									contentType : "application/json",
									success : function(data) {
										faceData = data;
										values = faceData.depth;
										worldWidth = faceData.width;
										worldDepth = faceData.height;
										worldHalfWidth = worldWidth / 2;
										worldHalfDepth = worldDepth / 2;
										// =====================

										camera.position.y = values[worldHalfDepth
												+ worldHalfWidth * worldDepth] + 5000;
										 camera.position.x = camera.position.x + 40;
										// - 180;
										// camera.position.y = camera.position.y
										// + 180;
										camera.position.z = 1500;
										startX = camera.position.x;
										startY = camera.position.y;
										startZ = camera.position.Z;

										var geometry = new THREE.PlaneGeometry(
												4000, 4000, worldWidth - 1,
												worldDepth - 1);// 7500

										for ( var i = 0, l = geometry.vertices.length; i < l; i++) {

											if (values[i] > 0) {
												// values[ i ] -= minZ;
												geometry.vertices[i].y = values[i];
											} else {
												geometry.vertices[i].y = 1;
											}

										}

										texture = new THREE.Texture(
												generateTexture(
														faceData.texture,
														worldWidth, worldDepth),
												new THREE.UVMapping(),
												THREE.ClampToEdgeWrapping,
												THREE.ClampToEdgeWrapping);
										texture.needsUpdate = true;

										mesh = new THREE.Mesh(geometry,
												new THREE.MeshBasicMaterial({
													map : texture
												}));
										scene.add(mesh);

										renderer = new THREE.WebGLRenderer();
										renderer.setSize(window.innerWidth,window.innerHeight);
										
										container.innerHTML = "";

										container
												.appendChild(renderer.domElement);

										stats = new Stats();
										stats.domElement.style.position = 'absolute';
										stats.domElement.style.top = '0px';
										container.appendChild(stats.domElement);
										
										$('#ajaxBusy').hide();
										$("#container div:not(#canvas)")
												.children().remove();
//										---
//										document.addEventListener('wheel',
//												onMousewheel, false); 
										
									
										
									},
									error : function(jqXHR, textStatus,
											errorThrown) {
										alert(errorThrown);
									}
								});

					}

					function generateTexture(texturedata, width, height) {
						var canvas, canvasScaled, context, image, imageData, counter, level, diff, vector3, sun, shade;

						canvas = document.createElement('canvas');
						canvas.width = width;
						canvas.height = height;

						context = canvas.getContext('2d');
						context.fillStyle = '#000';
						context.fillRect(0, 0, width, height);

						image = context.getImageData(0, 0, canvas.width,
								canvas.height);
						imageData = image.data;

						for ( var i = 0; i < texturedata.length; i += 4) {
							imageData[i] = texturedata[i];
							imageData[i + 1] = texturedata[i + 1];
							imageData[i + 2] = texturedata[i + 2];
						}

						context.putImageData(image, 0, 0);

						return canvas;

					}

					//
					function onDocumentMouseDown(event) {

						if(event.which == 1){
							isClick = true;
						} else if(event.which == 3){
							isRightClick = false;
						}

					}
					
					function onDocumentMouseUp(event) {

						if(event.which == 1){
							isClick = false;
						} else if(event.which == 3){
							isRightClick = false;
						}

					}

					function onDocumentMouseMove(event) {

						if(isClick){
							mouseX = (event.clientX - windowHalfX);
							mouseY = (event.clientY - windowHalfY);
						} else if(isClick){
							mouseRightX = (event.clientX - windowHalfX);
							mouseRightY = (event.clientY - windowHalfY);
						}

					}
					
					function onMousewheel(event) {
						if (event.detail) { /** Mozilla case. */
			                /** In Mozilla, sign of delta is different than in IE.
			                 * Also, delta is multiple of 3.
			                 */
							mouseDelta = -event.detail/3;
			        }
				 }
					
					function onContextMenuEvet(event) {
						return false;
					}
					

					function animate() {

						requestAnimationFrame(animate);

						render();
						stats.update();

					}

					function render() {

						 $('#x').html('<p>x=' + camera.position.x + ' mx ='+mouseRightX+'</p>');
						 $('#y').html('<p>y=' + camera.position.y + ' mx ='+mouseRightY+'</p>');
						 $('#z').html('<p>z='+camera.position.z+'</p>');
						//						

						// camera.lookAt( scene.position );

						// renderer.enableScissorTest( false );
						// renderer.clear();
						// renderer.enableScissorTest( true );

						
							
						camera.position.x = startX - mouseX * 7 + mouseRightX*50;
						camera.position.y = startY - mouseY * 7 + mouseRightY*50;
						
						//if ((camera.position.z - mouseDelta * 70 <= 3000) && (camera.position.z - mouseDelta * 70 >= 1500)) {
							camera.position.z = camera.position.z - mouseDelta * 70;
						//}
						
						mouseDelta = 0;

						controls.update(0);
						// controls.update(clock.getDelta());

						renderer.render(scene, camera);
						
						
					}
				});
//function touch() {
//	// Detect touch support
//	$.support.touch = 'ontouchend' in document;
//	// Ignore browsers without touch support
//	if (!$.support.touch) {
//		return;
//	}
//	var mouseProto = $.ui.mouse.prototype, _mouseInit = mouseProto._mouseInit, touchHandled;
//
//	function simulateMouseEvent(event, simulatedType) { // use this function to
//		// simulate mouse event
//		// Ignore multi-touch events
//		if (event.originalEvent.touches.length > 1) {
//			return;
//		}
//		event.preventDefault(); // use this to prevent scrolling during ui use
//
//		var touch = event.originalEvent.changedTouches[0], simulatedEvent = document
//				.createEvent('MouseEvents');
//		// Initialize the simulated mouse event using the touch event's
//		// coordinates
//		simulatedEvent.initMouseEvent(simulatedType, // type
//		true, // bubbles
//		true, // cancelable
//		window, // view
//		1, // detail
//		touch.screenX, // screenX
//		touch.screenY, // screenY
//		touch.clientX, // clientX
//		touch.clientY, // clientY
//		false, // ctrlKey
//		false, // altKey
//		false, // shiftKey
//		false, // metaKey
//		0, // button
//		null // relatedTarget
//		);
//
//		// Dispatch the simulated event to the target element
//		event.target.dispatchEvent(simulatedEvent);
//	}
//	mouseProto._touchStart = function(event) {
//		var self = this;
//		// Ignore the event if another widget is already being handled
//		if (touchHandled
//				|| !self._mouseCapture(event.originalEvent.changedTouches[0])) {
//			return;
//		}
//		// Set the flag to prevent other widgets from inheriting the touch event
//		touchHandled = true;
//		// Track movement to determine if interaction was a click
//		self._touchMoved = false;
//		// Simulate the mouseover event
//		simulateMouseEvent(event, 'mouseover');
//		// Simulate the mousemove event
//		simulateMouseEvent(event, 'mousemove');
//		// Simulate the mousedown event
//		simulateMouseEvent(event, 'mousedown');
//	};
//
//	mouseProto._touchMove = function(event) {
//		// Ignore event if not handled
//		if (!touchHandled) {
//			return;
//		}
//		// Interaction was not a click
//		this._touchMoved = true;
//		// Simulate the mousemove event
//		simulateMouseEvent(event, 'mousemove');
//	};
//	mouseProto._touchEnd = function(event) {
//		// Ignore event if not handled
//		if (!touchHandled) {
//			return;
//		}
//		// Simulate the mouseup event
//		simulateMouseEvent(event, 'mouseup');
//		// Simulate the mouseout event
//		simulateMouseEvent(event, 'mouseout');
//		// If the touch interaction did not move, it should trigger a click
//		if (!this._touchMoved) {
//			// Simulate the click event
//			simulateMouseEvent(event, 'click');
//		}
//		// Unset the flag to allow other widgets to inherit the touch event
//		touchHandled = false;
//	};
//	mouseProto._mouseInit = function() {
//		var self = this;
//		// Delegate the touch handlers to the widget's element
//		self.element.on('touchstart', $.proxy(self, '_touchStart')).on(
//				'touchmove', $.proxy(self, '_touchMove')).on('touchend',
//				$.proxy(self, '_touchEnd'));
//
//		// Call the original $.ui.mouse init method
//		_mouseInit.call(self);
//	};
//}
