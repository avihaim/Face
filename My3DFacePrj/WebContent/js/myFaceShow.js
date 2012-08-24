$(document)
		.ready(
				
				function() {

					var sceneDataDepth;
					var scaleSize = 5;
				   
//				    =============================================
				    var delta_x_rotate = 0;
					var delta_y_rotate = 0;
					var delta_x = 0;
					var delta_y = 0;

					var scale_factor = 1.0;
					
					var left_mouse_is_down = false;
					var right_mouse_is_down = false;
					var modelIsReady = false;
					var isMadeAMove = false;
					
					var oldx = 0;
					var oldy = 0;

					var touchAction = 0; // 0 = left mouse;  2 = right mouse
					
					var camera, scene, renderer;

					var mesh;
					
					var worldWidth = 6000, worldDepth = 6000;
					
//					==============================================
					
					
					var container = document.getElementById('container');
					
					
					if (!Detector.webgl) {
						Detector.addGetWebGLMessage();
						container.innerHTML = "";
					} else {
						init();
						initEvents();
					}
					
					
					function init() {
						// Setup the ajax indicator
						$('body')
								.append(
										'<div id="ajaxBusy"><p><img src="images/ajax-loader.gif"></p></div>');

						// Loading indication animation css design.
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

						// Start ajaxBusy
						$('#ajaxBusy').show();


						// Get the file model name
						var urlQuery = location.search;
						urlQuery = urlQuery.replace('?', '');
						var split = urlQuery.split('=');
						var fileName = split[1];
						
						var mode = "";
				          $("select option:selected").each(function () {
				        	  mode += $(this).text();
				              });
						
						updateSceneData(fileName,scaleSize,mode);
						
						// Add link to download a ZIP with the model images
						$('body')
						.append(
								'<div><a class="zipLink" href="ZipServlet?fileName='+fileName+'"></a></div>');
						
						// Add link to facebook like
						$('body')
						.append(
								'<iframe  style="display: none;" class="faceboklike" src="https://www.facebook.com/plugins/like.php?href=http://pdfstorage.mta.ac.il:8081/My3DFacePrj/myFaceShow.html?fileName='+fileName+
								'" "scrolling="no" frameborder="0" style="border:none; width:450px; height:80px"></iframe>');
						
						$(":range").rangeinput();
						 
						// FIX: Zoom out so the use can zoom in
						zoom(-360*15);
						
					}//end init()

					
					// Copy the texture data to canvas
					function generateTexture(texturedata, width, height) {
						var canvas, context, image, imageData;

						// Create new canvas
						canvas = document.createElement('canvas');
						canvas.width = width;
						canvas.height = height;

						context = canvas.getContext('2d');
						context.fillStyle = '#000';
						context.fillRect(0, 0, width, height);

						// Get a "reference" to canvas
						image = context.getImageData(0, 0, width,height);
						
						imageData = image.data;

						// Copy the data
						for ( var i = 0; i < texturedata.length; i += 4) {
							imageData[i] = texturedata[i];
							imageData[i + 1] = texturedata[i + 1];
							imageData[i + 2] = texturedata[i + 2];
							imageData[i + 3] = texturedata[i + 3];
						}

						// Put the canvas in the page
						context.putImageData(image, 0, 0);

						return canvas;

					}

					//
					
					function updateSceneData(fileName,scaleSize,mode) {
						
						container = document.getElementById('container');

						var dataString = new Object();
						
						// The model name
						dataString["fileName"] = fileName;
						
						// The mode we want. the mode (full rgb, single color..)
						dataString["mode"] = mode;

						// Ajax call to server side to get the model data 
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
					// Success callback when calling ImageRGBServlet. 
					function successUpdateData(data) {
						
						// We save all depth data for the scale changes 
						sceneDataDepth = data.depth;
						updateData(data);
					}
					
					function updateData(faceData) {
						
//						modelIsReady = false;
						worldWidth = faceData.width;
						worldDepth = faceData.height;
						// =====================
						
						scene = new THREE.Scene();

						// LIGHTS
//						 Removed unneded scene.add(ambientLight);
						 ambientLight = new THREE.AmbientLight( 0xFFFFFF
						 );
						 scene.add( ambientLight );

						// CAMERA
						camera = new THREE.PerspectiveCamera(60,
								window.innerWidth / window.innerHeight, 1,
								400000);

						camera.position.y = 2000;
						camera.position.x = 0;
						camera.position.z = 1;

						// Removed unneded scene.add(camera);
						 scene.add(camera);
						
						//var width_tiles_number = 80;
						//var depth_tiles_number = 80;
						
						// Create new geometry object
						var geometry = new THREE.PlaneGeometry(
								//4000, 4000,width_tiles_number  ,depth_tiles_number);
								2000, 2000, worldWidth - 1,worldDepth - 1);
						//var width_ratio = worldWidth/width_tiles_number;
						//var depth_ratio = worldDepth/depth_tiles_number;
						
						// Copy the heights map to the geometry
						for ( var i = 0, l = geometry.vertices.length; i < l; i++) {
							
							//var curr_depth = i/width_tiles_number;
							//var curr_width = i%width_tiles_number;
							
							//var real_pixel_pos =Math.floor((curr_depth*depth_ratio)*worldWidth + curr_width*width_ratio);
							
							if (faceData.depth[i] > 0) {
								geometry.vertices[i].y = faceData.depth[i]*scaleSize;
							} else {
								geometry.vertices[i].y = 0;
							}
						}
						
						
						// Create the texture for the mash
						var texture = new THREE.Texture(
								generateTexture(faceData.texture,worldWidth, worldDepth));
//								new THREE.UVMapping(),THREE.ClampToEdgeWrapping,THREE.ClampToEdgeWrapping,THREE.RGBAFormat);
						
						texture.needsUpdate = true;

						// For the single color model we probably need to use the MeshLambertMaterial
//						material = new THREE.MeshLambertMaterial({map : texture, reflectivity: 0.95, refractionRatio: 0.50, shading: THREE.SmoothShading });
						var material = new THREE.MeshBasicMaterial({map : texture});
						
						// Create the mesh
						mesh = new THREE.Mesh(geometry,material);
						
						//Flag geometry can update dynamic
						mesh.geometry.dynamic = true;
						
						mesh.doubleSided = true;
						
						// FIX: The mesh wosen't at the right rotation, so we rotate it in 90 dr'
						mesh.rotation.x = 90 * (Math.PI/180);
						
						// We like that the camera lookAt the model, 
						// we don't use it at the render function because we 
						// want the user can be free to move the model   
						camera.lookAt( mesh.position );
						
						// Add the model to the scene
						scene.add(mesh);
						
						renderer = new THREE.WebGLRenderer();

						// Set the renderer size to window wide and height - 80 
						// to save same place to control icons
						renderer.setSize(window.innerWidth , window.innerHeight -80);
						
						container.innerHTML = "";

						container
								.appendChild(renderer.domElement);
						
						// Hide the ajaxBusy image
						$('#ajaxBusy').hide();
						
						modelIsReady = true;
						
						animate();
						
					}
					
					var newScaleSize = $("#scaleSize").val();
					
					
					var vctZ = new THREE.Vector3(0,0,1);
					var vctX = new THREE.Vector3(1,0,0);
					var vctXYZ = new THREE.Vector3(1,1,1);
					
					function render() {

						// modelIsReady - we want to start the render operation
						// only after the init function is finished and the model is ready to use
						// isMadeAMove - try to save some memory and CPU by render only after
						// the user asked to do some moves in the model
						if ((modelIsReady == true) && (isMadeAMove == true)) {
							// For Debug only
//							 $('#x').html('<p>x=' + camera.position.x + ' mx ='</p>');
//							 $('#y').html('<p>y=' + camera.position.y + ' my ='</p>');
//							 $('#z').html('<p>z=' + camera.position.z + '</p>');
						
							 
							var tempMat = new THREE.Matrix4();
							mesh.scale.x = mesh.scale.y = mesh.scale.z = scale_factor;
							tempMat.makeRotationAxis(vctZ, -delta_x_rotate);
							tempMat.multiplySelf(mesh.matrix);
							mesh.matrix = tempMat;
							
							tempMat = new THREE.Matrix4();
							tempMat.makeRotationAxis(vctX, delta_y_rotate);
							tempMat.multiplySelf(mesh.matrix);
							mesh.matrix = tempMat;
							mesh.rotation.getRotationFromMatrix(mesh.matrix,vctXYZ);
							
							
							camera.position.x -= delta_x*14;
							camera.position.z -= delta_y*14;
							delta_x_rotate = 0;
							delta_y_rotate = 0;
							delta_x = 0;
							delta_y = 0;
							
							newScaleSize = $("#scaleSize").val();
							
							// Update the scale only if there is a change in the scaleSize
							if(newScaleSize != scaleSize) {
								
								scaleSize = newScaleSize;
								
								// Copy the heights map to the geometry * scaleSize 
								for ( var i = 0, l = mesh.geometry.vertices.length; i < l; i++) {
	
									if (mesh.geometry.vertices[i].y > 0 ) {
										mesh.geometry.vertices[i].y = sceneDataDepth[i]*scaleSize;
									} 
								}
								
								//Flag vertices need to update in the scene
								mesh.geometry.verticesNeedUpdate = true;
							}
							
	
							renderer.render(scene, camera);
						}
						
					}
					
					function initEvents() {
						
						//Start add all the mouse event
						var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x
						
						// Event for mouse wheel - zoom in/out
						container.addEventListener(mousewheelevt, onMousewheel, false);
						
						// Event for mouse down
						container.addEventListener('mousedown',
								onDocumentMouseDown); 
						
						// Event for mouse up
						container.addEventListener('mouseup',
								onDocumentMouseUp);
						
						// Event for mouse move
						container.addEventListener('mousemove',
								onDocumentMouseMove, false);
						
						// Event for cancel Context Menu
						container.addEventListener('onContextMenu',
								onContextMenuEvet, false); 
						
						// Event for Change model mode
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
						 
						//End add all the mouse event
						 
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

					}// end init_events()
					
					function onDocumentMouseDown(event) {
						
						var evt=window.event || event;
						
						if (evt.button == 0)
						{
							isMadeAMove = true;
							left_mouse_is_down = true;
							oldx = evt.clientX;
							oldy = evt.clientY;
						}
						else if (evt.button == 2)
						{
							isMadeAMove = true;
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
		        			return false;

					}
					
					function onDocumentMouseUp(event) {
						
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
						
						isMadeAMove = false;
						
						if (evt.stopPropagation)
		            		evt.stopPropagation();
						if (evt.preventDefault) //disable default wheel action of scrolling page
		        			evt.preventDefault();
		    			else
		        			return false;

					}

					function onDocumentMouseMove(event) {

						var evt=window.event || event;
						var newx,newy;
						var rotate_factor = 100;
						delta_x_rotate = 0;
						delta_y_rotate = 0;
						delta_x = 0;
						delta_y = 0;
						if (left_mouse_is_down)
						{
							isMadeAMove = true;
							
							newx = event.clientX;
							newy = event.clientY;
							
							delta_x_rotate = (newx - oldx)/rotate_factor;
							delta_y_rotate = (newy - oldy)/rotate_factor;
							
							oldx = newx;
							oldy = newy;
						}
						else if (right_mouse_is_down)
						{
							isMadeAMove = true;
							
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
		        			return false;

					}
					
					function onMousewheel(e) {
						
						var evt=window.event || e ;
						var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta;
						
						zoom(delta);
						isMadeAMove = true;
		    			if (evt.preventDefault) //disable default wheel action of scrolling page
		        			evt.preventDefault();
		    			else
		        			return false;
				    }// end: onMousewheel()
					
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
					} //end: zoom()
					
					function onContextMenuEvet(event) {
						return false;
					}
					
					
					function animate() {
						isMadeAMove = true;
						
						requestAnimationFrame(animate);

						render();
						
						isMadeAMove = false;
					}
					
					
					// Touch functions
					
					// Zoom out one wheel tik
					function onZoomOut(){
						zoom(-360);
					}
					
					// Zoom in one wheel tik
					function onZoomIn(){
						zoom(360);
					}
					
					// Change between Right click to left click Simulation 
					function changeTouchAction() {
						if(touchAction == 0) { // was left 
							touchAction = 2; // change to right
							$('#touchAction').removeClass('transform-move');
							$('#touchAction').addClass('transform-rotate');
						} else { // was right 
							touchAction = 0; // change to left 
							$('#touchAction').removeClass('transform-rotate');
							$('#touchAction').addClass('transform-move');
						}
					}
					
					function touchHandler(event) {
					    var touches = event.changedTouches,
					        point = touches[0],
					        type = "";
					    
					    switch(event.type) {
					        case "touchstart": type = "mousedown"; break;
					        case "touchmove":  type="mousemove"; break;        
					        case "touchend":   type="mouseup"; break;
					        default: return;
					    }
					   
					    
					    var simulatedEvent = document.createEvent("MouseEvent");
					    
					    
					    // initMouseEvent(type, canBubble, cancelable, view, clickCount,
					    //           screenX, screenY, clientX, clientY, ctrlKey,
					    //           altKey, shiftKey, metaKey, button, relatedTarget);
					    simulatedEvent.initMouseEvent(type, true, true, window, 1,
					    							point.screenX, point.screenY,
					    							point.clientX, point.clientY, false,
					                              false, false, false, touchAction, null);

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
