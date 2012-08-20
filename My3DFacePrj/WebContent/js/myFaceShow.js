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
					
					
					var touchAction = 0; // 0 = left mouse;  2 = right mouse

					
//					==============================================
					
					
				
//					var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x
//						 
//					if (document.attachEvent) //if IE (and Opera depending on user setting)
//					    document.attachEvent("on"+mousewheelevt,onMousewheel);
//					else if (document.addEventListener) //WC3 browsers
//					    document.addEventListener(mousewheelevt,onMousewheel, false);
					
					var container = document.getElementById('container');
					
					var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x
						 
					container.addEventListener(mousewheelevt, onMousewheel, false);
					
					container.addEventListener('mousedown',
							onDocumentMouseDown); 
					
					container.addEventListener('mouseup',
							onDocumentMouseUp);
					
					container.addEventListener('mousemove',
							onDocumentMouseMove, false);
					
					container.addEventListener('onContextMenu',
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

					var stats;

					var camera, controls, scene, renderer;

					var mesh, texture;

					var worldWidth = 6000, worldDepth = 6000, worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

					var clock = new THREE.Clock();
					
					$.support.touch = 'ontouchend' in document;
					
					// Ignore browsers without touch support
					if ($.support.touch) {
						touchInit();
						
						// Add button to change touch behavior
						$('body')
						.append('<div id="touchAction" class="transform-move"></div>');
						$('#touchAction').bind('mousedown',changeTouchAction);
						
						// Add button to zoom-in in touch
						$('body')
						.append('<div id="zoom-in" </div>');
						$('#zoom-in').bind('mousedown',onZoomIn);
						
						// Add button to zoom-in in touch
						$('body')
						.append('<div id="zoom-out" </div>');
						$('#zoom-out').bind('mousedown',onZoomOut);
					}
					
					

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
						
						camera.position.y = 160000;
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
								'<iframe  style="display: none;" class="faceboklike" src="https://www.facebook.com/plugins/like.php?href=http://pdfstorage.mta.ac.il:8081/My3DFacePrj/myFaceShow.html?fileName='+fileName+
								'" "scrolling="no" frameborder="0" style="border:none; width:450px; height:80px"></iframe>');
						
						zoom(-360*15);

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

						// , shading: THREE.FlatShading
//						material = new THREE.MeshLambertMaterial({map : texture, reflectivity: 0.95, refractionRatio: 0.50, shading: THREE.SmoothShading });
						material = new THREE.MeshBasicMaterial({map : texture});
						//MeshLambertMaterial
						//MeshBasicMaterial
						
						mesh = new THREE.Mesh(geometry,material);
						
						mesh.rotation.x = 90 * (Math.PI/180);
						camera.lookAt( mesh.position );
						scene.add(mesh);
						

//						renderer = new THREE.CanvasRenderer();
						renderer = new THREE.WebGLRenderer();
						//renderer.setSize(window.innerWidth,window.innerHeight);
						renderer.setSize(window.innerWidth , window.innerHeight -80);
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
						var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta;
						
						zoom(delta);
		    			
		    			if (evt.preventDefault) //disable default wheel action of scrolling page
		        			evt.preventDefault();
		    			else
		        			return false;
				    }
					
					function zoom(delta) {
						
						var step_size = 0.01;
						var upper_limit = 1.0;
						var lower_limit = 0.05;
		    			 
		    			var delta_steps = delta / 120;
		    			var new_scale_factor;
		    			
		    			new_scale_factor = scale_factor + (delta_steps * step_size);
		    			
		    			if (new_scale_factor < lower_limit)
		    				new_scale_factor  = lower_limit;
		    			else if (new_scale_factor > upper_limit)
		    				new_scale_factor = upper_limit;
		    			scale_factor = new_scale_factor;
					}
					
					function onZoomOut(){
						zoom(-360);
					}
					
					function onZoomIn(){
						zoom(360);
					}
					
					function onContextMenuEvet(event) {
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
					
					function changeTouchAction() {
						if(touchAction == 0) {
							touchAction = 2;
							$('#touchAction').removeClass('transform-move');
							$('#touchAction').addClass('transform-rotate');
						} else {
							touchAction = 0;
							$('#touchAction').removeClass('transform-rotate');
							$('#touchAction').addClass('transform-move');
						}
					}
					
					function touchHandler(event)
					{
						
						
						//alert(event.type);
					    var touches = event.changedTouches,
					        point = touches[0],
					        type = "";
					    
					    switch(event.type) {
					        case "touchstart": type = "mousedown"; break;
					        case "touchmove":  type="mousemove"; break;        
					        case "touchend":   type="mouseup"; break;
					        default: return;
					    }

					             //initMouseEvent(type, canBubble, cancelable, view, clickCount,
					    //           screenX, screenY, clientX, clientY, ctrlKey,
					    //           altKey, shiftKey, metaKey, button, relatedTarget);
					    
					    var simulatedEvent = document.createEvent("MouseEvent");
					    simulatedEvent.initMouseEvent(type, true, true, window, 1,
					    							point.screenX, point.screenY,
					    							point.clientX, point.clientY, false,
					                              false, false, false, touchAction/*left*/, null);

					    point.target.dispatchEvent(simulatedEvent);
					    event.preventDefault();
					}

					function touchInit()
					{
					    document.addEventListener("touchstart", touchHandler, true);
					    document.addEventListener("touchmove", touchHandler, true);
					    document.addEventListener("touchend", touchHandler, true);
					    document.addEventListener("touchcancel", touchHandler, true);    
					}
					
				});
