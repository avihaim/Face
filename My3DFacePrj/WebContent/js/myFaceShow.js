$(document)
		.ready(
				function() {

					
					var SCREEN_WIDTH = window.innerWidth;
					var SCREEN_HEIGHT = window.innerHeight;

					var windowHalfX = window.innerWidth / 2;
					var windowHalfY =  window.innerHeight / 2;

					var mouseX = 0, mouseY = 0;
					var mouseRightX = 0, mouseRightY = 0;
					var startX = 0;
					var startY = 0;
					var startZ = 0;
					var mouseDelta = 0;
					var isClick = false;
					var isRightClick = false;
					var sceneData;
					var uniforms;
					var scaleSize = 5;
					var width, height;
					var imageMoveX = 0;
				    var imageMoveY = 0;
				    var geometry;
				    var material;
				    var x = 0;
				    
//				    =============================================
				    var delta_x_rotate = 0;
					var delta_y_rotate = 0;
					var delta_x = 0;
					var delta_y = 0;

					var scale_factor = 1.0;
					
					var left_mouse_is_down = false;
					var right_mouse_is_down = false;
					
					var oldx = 0;
					var oldy = 0;

					var rotate_matrix;

					
//					==============================================
					
					
				
//					var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x
//						 
//					if (document.attachEvent) //if IE (and Opera depending on user setting)
//					    document.attachEvent("on"+mousewheelevt,onMousewheel);
//					else if (document.addEventListener) //WC3 browsers
//					    document.addEventListener(mousewheelevt,onMousewheel, false);
					
					var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x
						 
					document.addEventListener(mousewheelevt, onMousewheel, false);
					
					document.addEventListener('mousedown',
							onDocumentMouseDown); 
					
					document.addEventListener('mouseup',
							onDocumentMouseUp);
					
					document.addEventListener('mousemove',
							onDocumentMouseMove, false);
					
					document.addEventListener('onContextMenu',
							onContextMenuEvet, false); 
					
					$('#scaleSizeSubmit').click(scaleSizeOninput);
					
//					$('#modeSelect').addEventListener('onchange',
//							selectModeEvent, false);
					
					 $("select").change(function () {
				          var mode = "";
				          $("select option:selected").each(function () {
				        	  mode += $(this).text();
				              });
				          
				            $('#ajaxBusy').show();
				          
				          	var urlQuery = location.search;
							urlQuery = urlQuery.replace('?', '');
							var split = urlQuery.split('=');

							var fileName = split[1];
							
							updateSceneData(fileName,scaleSize,mode);
							
							
				        });


					
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

						scene = new THREE.Scene();
						
//						 camera = new THREE.PerspectiveCamera( 0, 0, 0, 0 );
						camera = new THREE.PerspectiveCamera(1,
								window.innerWidth / window.innerHeight, 1,
								400000);
						
						camera.position.y = 260000;
   					    camera.position.x = 0;
   					    camera.position.z = scale_factor ;
						
						scene.add(camera);
						
						// LIGHTS

						ambientLight = new THREE.AmbientLight( 0xFFFFFF );
						scene.add( ambientLight );
//
//						pointLight = new THREE.PointLight( 0xffffff, 1.25, 1000 );
//						pointLight.position.set( 0, 0, 600 );
//
//						scene.add( pointLight );
//
//						directionalLight = new THREE.DirectionalLight( 0xffffff );
//						directionalLight.position.set( 1, -0.5, -1 );
//						scene.add( directionalLight );
						
						
						
						
						
						//controls = new THREE.PathControls(camera);
						
						
						
//						controls.movementSpeed = 1000;
//						controls.lookSpeed = 0.1;

						var faceData;

						var urlQuery = location.search;
						urlQuery = urlQuery.replace('?', '');
						var split = urlQuery.split('=');

						var fileName = split[1];
						
						var mode = "";
				          $("select option:selected").each(function () {
				        	  mode += $(this).text();
				              });
						
						updateSceneData(fileName,scaleSize,mode);
						
						$('body')
						.append(
								'<div class="zipLink"><a href="ZipServlet?fileName='+fileName+'">download</a></div>');
						
						$('body')
						.append(
								'<iframe class="faceboklike" src="https://www.facebook.com/plugins/like.php?href=http://pdfstorage.mta.ac.il:8081/My3DFacePrj/myFaceShow.html?fileName='+fileName+
								'" "scrolling="no" frameborder="0" style="border:none; width:450px; height:80px"></iframe>');
						
						

					}

					function generateTexture(texturedata, width, height) {
						var canvas, canvasScaled, context, image, imageData, counter, level, diff, vector3, sun, shade;

						canvas = document.createElement('canvas');
						canvas.width = width;
						canvas.height = height;

						context = canvas.getContext('2d');
						context.fillStyle = '#000';
						context.fillRect(0, 0, width, height);

						image = context.getImageData(0, 0, width,
								height);
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
					
					function updateSceneData(fileName,scaleSize,mode) {
						
						container = document.getElementById('container');

						var dataString = new Object();
						dataString["fileName"] = fileName;
						dataString["mode"] = mode;

						$
								.ajax({
									url : "ImageRGBServlet",
									data : dataString,
									dataType : "json",
									contentType : "application/json",
									success : successUpdateData,
									error : function(jqXHR, textStatus,
											errorThrown) {
										alert(errorThrown);
									}
								});
					}
					function successUpdateData(data) {
						sceneData = data;
						var scaleSize = $("#scaleSize").val();
						updateData(data,parseInt(scaleSize));
					}
					
					function updateData(data,scaleSize) {
						
						faceData = data;
						values = faceData.depth;
						worldWidth = faceData.width;
						worldDepth = faceData.height;
						worldHalfWidth = worldWidth / 2;
						worldHalfDepth = worldDepth / 2;
						width = faceData.width;
						height = faceData.height;
						// =====================
						
						

						
						//camera.position.y = 0;
//						camera.position.y = values[worldHalfDepth + worldHalfWidth * worldDepth] + 5000;
//						 //camera.position.x = 0;
//						 camera.position.x = 40;
//						// - 180;
//						// + 180;
//						camera.position.z = 1500;
						//camera.position.z = 3000;
						
						startX = camera.position.x;
						startY = camera.position.y;
						startZ = camera.position.Z;
						
						
						geometry = new THREE.PlaneGeometry(
								4000, 4000, worldWidth - 1,worldDepth - 1);
					//	4000, 4000,0,0);
						

						for ( var i = 0, l = geometry.vertices.length; i < l; i++) {

							if (values[i] > 0) {
								geometry.vertices[i].y = values[i]*scaleSize;
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
						
						var ambient = 0x111111, diffuse = 0xbbbbbb, specular = 0x060606, shininess = 35;

						var r = "textures/cube/SwedishRoyalCastle/";
						var urls = [ r + "px.jpg", r + "nx.jpg",
									 r + "py.jpg", r + "ny.jpg",
									 r + "pz.jpg", r + "nz.jpg" ];

						var textureCube = THREE.ImageUtils.loadTextureCube( urls );
						
						// , shading: THREE.FlatShading
//						material = new THREE.MeshLambertMaterial({map : texture, reflectivity: 0.95, refractionRatio: 0.50, shading: THREE.SmoothShading });
						material = new THREE.MeshBasicMaterial( { map : texture } );
						//MeshLambertMaterial
						//MeshBasicMaterial CC33FF
						
						mesh = new THREE.Mesh(geometry,material);
						
						mesh.rotation.x = 90 * (Math.PI/180);
						camera.lookAt( mesh.position );
						scene.add(mesh);
						

//						renderer = new THREE.CanvasRenderer();
						renderer = new THREE.WebGLRenderer();
						//renderer.setSize(window.innerWidth,window.innerHeight);
						renderer.setSize(window.innerWidth , window.innerHeight -30);
						//renderer.setViewport(0,0, width*2, height*2);
//						renderer.setViewport(-window.innerWidth,-window.innerHeight, width, height);
						
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
						
					}

					function render() {

						 $('#x').html('<p>x=' + camera.position.x + ' mx ='+mouseRightX+'</p>');
						 $('#y').html('<p>y=' + camera.position.y + ' my ='+mouseRightY+'</p>');
						 $('#z').html('<p>z=' + camera.position.z + '</p>');
						//						

						// camera.lookAt( scene.position );

						// renderer.enableScissorTest( false );
						// renderer.clear();
						// renderer.enableScissorTest( true );
						 
						 
						 
//						imageMoveX  = mouseRightX;
//						imageMoveY = -mouseRightY; 
//						
//						camera.position.x = startX - mouseX * 7;
//						camera.position.Y = startY - mouseY * 7;
						
						
						
						//if ((camera.position.z - mouseDelta * 70 <= 3000) && (camera.position.z - mouseDelta * 70 >= 1500)) {
//							camera.position.Y = startY - mouseDelta * 7;
						//}
//						mouseDelta = 0;
						
//						renderer.setViewport(0, 0, width, height);
//						renderer.setViewport(imageMoveX, imageMoveY, width, height);
						
//						camera.updateProjectionMatrix();
						
//						if (( left_mouse_is_down ) || (right_mouse_is_down)) {
					//	camera.position.z = scale_factor ;
						var tempMat = new THREE.Matrix4();
						mesh.scale.x = mesh.scale.y = mesh.scale.z = scale_factor;
						tempMat.makeRotationAxis(new THREE.Vector3(0,0,1), -delta_x_rotate);
						tempMat.multiplySelf(mesh.matrix);
						mesh.matrix = tempMat;
						tempMat = new THREE.Matrix4();
						tempMat.makeRotationAxis(new THREE.Vector3(1,0,0), delta_y_rotate);
						tempMat.multiplySelf(mesh.matrix);
						mesh.matrix = tempMat;
						mesh.rotation.getRotationFromMatrix(mesh.matrix,new THREE.Vector3(1,1,1));
						
						
						camera.position.x -= delta_x*14;
						camera.position.z -= delta_y*14;
						delta_x_rotate = 0;
						delta_y_rotate = 0;
						delta_x = 0;
						delta_y = 0;
//						}
						 
						//controls.update(0);
						// controls.update(clock.getDelta());
					//	

						renderer.render(scene, camera);
						
						
					}
					
					
					
					function onDocumentMouseDown(event) {

//						if(event.which == 1){
//							isClick = true;
//						} else if(event.which == 3){
//							isRightClick = true;
//						}
						
						var evt=window.event || event;
						
						if (evt.button == 0)
						{
							left_mouse_is_down = true;
							oldx = evt.clientX;
							oldy = evt.clientY;
						}
						else if (evt.button == 2)
						{
							right_mouse_is_down = true;
							oldx = evt.clientX;
							oldy = evt.clientY;
						}
						evt.returnValue = false;
						if (evt.stopPropagation)
		            		evt.stopPropagation();
						if (evt.preventDefault) //disable default wheel action of scrolling page
		        			evt.preventDefault();
		    			else
		        			return false

					}
					
					function onDocumentMouseUp(event) {

//						if(event.which == 1){
//							isClick = false;
//						} else if(event.which == 3){
//							isRightClick = false;
//						}
						
						var evt=window.event || event;
						if (evt.button == 0)
						{
							left_mouse_is_down = false;
						}
						else if (evt.button == 2)
						{
							right_mouse_is_down = false;
							delta_x = 0;
						 	delta_y = 0;
						}
						evt.returnValue = false;
						if (evt.stopPropagation)
		            		evt.stopPropagation();
						if (evt.preventDefault) //disable default wheel action of scrolling page
		        			evt.preventDefault();
		    			else
		        			return false

					}

					function onDocumentMouseMove(event) {

//						if(isClick){
//							mouseX = (event.clientX - windowHalfX);
//							mouseY = (event.clientY - windowHalfY);
//						} else if(isRightClick){
//							
//							mouseRightX = (event.clientX - windowHalfX);
//							mouseRightY =  (event.clientY - windowHalfY);
//						}
						
						var evt=window.event || event;
						var newx,newy;
						var rotate_factor = 100;
						delta_x_rotate = 0;
						delta_y_rotate = 0;
						delta_x = 0;
						delta_y = 0;
						if (left_mouse_is_down)
						{
							newx = event.clientX;
							newy = event.clientY;
							
							delta_x_rotate = (newx - oldx)/rotate_factor;
							delta_y_rotate = (newy - oldy)/rotate_factor;
							
							oldx = newx;
							oldy = newy;
						}
						else if (right_mouse_is_down)
						{
							newx = event.clientX;
							newy = event.clientY;
							
							delta_x = (newx - oldx);
							delta_y = (newy - oldy);
							
							oldx = newx;
							oldy = newy;
						
						}
						
						evt.returnValue = false;
						if (evt.stopPropagation)
		            		evt.stopPropagation();
						if (evt.preventDefault) //disable default wheel action of scrolling page
		        			evt.preventDefault();
		    			else
		        			return false

					}
					
					function onMousewheel(e) {
//						if (event.detail) { /** Mozilla case. */
//			                /** In Mozilla, sign of delta is different than in IE.
//			                 * Also, delta is multiple of 3.
//			                 */
//							mouseDelta = -event.detail/3;
						
						
						var evt=window.event || e ;
						
						var step_size = 0.01;
						var upper_limit = 1.0;
						var lower_limit = 0.05;
		    			var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta; 
		    			var delta_steps = delta / 120;
		    			var new_scale_factor;
		    			
		    			new_scale_factor = scale_factor + (delta_steps * step_size);
		    			
		    			if (new_scale_factor < lower_limit)
		    				new_scale_factor  = lower_limit;
		    			else if (new_scale_factor > upper_limit)
		    				new_scale_factor = upper_limit;
		    			scale_factor = new_scale_factor;
		    			
		    			if (evt.preventDefault) //disable default wheel action of scrolling page
		        			evt.preventDefault();
		    			else
		        			return false;
				 }
					
					function onContextMenuEvet(event) {
						alert("onContextMenuEvet");
					//	event.preventDefault();
						return false;
					}
					
					function scaleSizeOninput() {
						scaleSize = $("#scaleSize").val();
						
						updateData(sceneData,parseInt(scaleSize));
						
//						// set the geometry to dynamic
//						// so that it allow updates
//						mesh.geometry.dynamic = true;
//						
//						scaleSize = parseInt(scaleSize) * 2;
//						
//						for ( var i = 0, l = mesh.geometry.vertices.length; i < l; i++) {
//
//							if (values[i] > 0) {
//								mesh.geometry.vertices[i].y = values[i]*scaleSize;
//							} else {
//								mesh.geometry.vertices[i].y = 1;
//							}
//
//						}
						
					}
					
					function animate() {

						requestAnimationFrame(animate);

						render();
						stats.update();

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
//		
//		simulateMouseEvent(event, 'mouseup');
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
