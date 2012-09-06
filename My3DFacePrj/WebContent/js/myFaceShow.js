$(document)
		.ready(
				
				function() {

					var sceneDataDepth;
//					var sceneData;
					var scaleSize = 12;
					var textureMode = 'rgb';
					var meshMatrix;
					
					var cameraPosition;
					
					var isModeCahge = false;
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

					var mesh ;
					
					var worldWidth = 6000, worldDepth = 6000;
					
//					==============================================
					
					// the container div of the webgl canvas.
					var container = document.getElementById('container');
					
					// Inits the new slider members.
					var slider  = $('#slider');
					var tooltip = $('.tooltip');
					
					if (!Detector.webgl) {
						Detector.addGetWebGLMessage();
						container.innerHTML = "";
					} else {
						
						
						init();
						initEvents();
						//AMIR:for debug
						/*
						initNewUiControls();*/
						
						// AMIR: this is the first selected default value of the select box.
						/*
						$("#modeSelect option:selected").each(function () {
				        	  alert( $(this).text());
				           });*/
					}
					
					function initscene() {
						scene = new THREE.Scene();

						// LIGHTS
						var ambient = new THREE.AmbientLight( 0xffffff );
						scene.add( ambient );

						spotLight =  new THREE.SpotLight( 0xffffff, 0.5, 2390 ,Math.PI/2,0.01);
						spotLight.position.set( 0, 1390, 0 );
						
						scene.add( spotLight );
						
						
						// CAMERA
						camera = new THREE.PerspectiveCamera(10,
								window.innerWidth / window.innerHeight, 1,
								400000);
						
						if (isModeCahge == false) {
							camera.position.y = 10000;
							camera.position.x = 0;
							camera.position.z = 1;
						} else {
							camera.position.x = cameraPosition.x;
							camera.position.z = cameraPosition.z;
						}
						
						
						
						// Removed uneeded scene.add(camera);
						scene.add(camera);
						
						
					}
					
					// Inits the canvas.
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
						
						initscene();
						
						updateSceneData(fileName,scaleSize,textureMode);
						
						// Add link to download a ZIP with the model images
						$('body')
						.append(
								'<div><a class="zipLink" href="ZipServlet?fileName='+fileName+'"></a></div>');
						
						// Add link to facebook like
						$('body')
						.append(
								'<iframe  style="display: none;" class="faceboklike" src="https://www.facebook.com/plugins/like.php?href=http://pdfstorage.mta.ac.il:8081/My3DFacePrj/myFaceShow.html?fileName='+fileName+
								'" "scrolling="no" frameborder="0" style="border:none; width:450px; height:80px"></iframe>');
						
						
						// Create the new slider div.
						initNewUiControls();
												 
						// FIX: Zoom out so the use can zoom in
						zoom(-360*20);
						
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
									if(errorThrown != '') {
										alert(errorThrown);
									}
									
								}
							});
					}
					// Success callback when calling ImageRGBServlet. 
					function successUpdateData(data) {
						
						// We save all depth data for the scale changes 
						sceneDataDepth = data.depth;
//						sceneData = data;
						updateData(data);
					}
					
					function updateData(faceData) {
						
//						modelIsReady = false;
						worldWidth = faceData.width;
						worldDepth = faceData.height;
						// =====================
						
						
						// Create new geometry object
						var geometry = new THREE.PlaneGeometry(
								//4000, 4000,width_tiles_number  ,depth_tiles_number);
								2000, 2000, worldWidth - 1,worldDepth - 1);
						
						// Copy the heights map to the geometry
						var i = faceData.depth.length;
						while (--i >= 0)  {
							
							if (faceData.depth[i] > 0) {
								geometry.vertices[i].y = faceData.depth[i]*scaleSize;
							} else {
								geometry.vertices[i].y = 0;
							}
						}
						
						var material;
						
						if(textureMode == 'singleColor') {
							
							material = new THREE.MeshPhongMaterial( { ambient: 0x002266, diffuse:0x002266, specular:0xffffff, metal: true , shading: THREE.SmoothShading, combine: THREE.MixOperation, reflectivity: 2.0, shininess: 30} );
							
							geometry.computeFaceNormals();
							geometry.computeVertexNormals();

			
						} else {
							
							// Create the texture for the mash
							var texture = new THREE.Texture(
									generateTexture(faceData.texture,worldWidth, worldDepth));
							
							texture.needsUpdate = true;
							
							material = new THREE.MeshBasicMaterial({map : texture});
						}
						
						// Create the mesh
						mesh = new THREE.Mesh(geometry,material);
						
						//Flag geometry can update dynamic
						mesh.geometry.dynamic = true;
						
						mesh.doubleSided = true;
						
						if (isModeCahge == true) {
							mesh.matrix =	meshMatrix;
						} else {
							// We like that the camera lookAt the model, 
							// we don't use it at the render function because we 
							// want the user can be free to move the model   
							camera.lookAt( mesh.position );
						}
						
						// FIX: The mesh wosen't at the right rotation, so we rotate it in 90 dr'
						mesh.rotation.x = 90 * (Math.PI/180);
						
						
						
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
						
						$('#modeSelect').removeAttr('disabled');
						
						modelIsReady = true;
						
						animate();
					}
					
					//var newScaleSize = $("#scaleSize").val();
					var newScaleSize = $('#slider').slider('value');
				
					var vctZ = new THREE.Vector3(0,0,1);
					var vctX = new THREE.Vector3(1,0,0);
					var vctXYZ = new THREE.Vector3(1,1,1);
					
					function render() {

						// modelIsReady - we want to start the render operation
						// only after the init function is finished and the model is ready to use
						// isMadeAMove - try to save some memory and CPU by render only after
						// the user asked to do some moves in the model
						if ((modelIsReady == true) && (isMadeAMove == true)) {
							 
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
							
							
							camera.position.x -= delta_x*10;
							camera.position.z -= delta_y*10;
							delta_x_rotate = 0;
							delta_y_rotate = 0;
							delta_x = 0;
							delta_y = 0;
							
							//newScaleSize = $("#scaleSize").val();
							newScaleSize = $('#slider').slider('value');
							
							// Update the scale only if there is a change in the scaleSize
							if(newScaleSize != scaleSize) {
								
								scaleSize = newScaleSize;
								
								// Copy the heights map to the geometry * scaleSize 
								
								var i = mesh.geometry.vertices.length;
								while (--i >= 0)  {
	
									if (sceneDataDepth[i] > 0 ) {
										mesh.geometry.vertices[i].y = sceneDataDepth[i]*scaleSize;
									} 
								}
//								pointLight.position.y = 33*scaleSize;
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
						
						
						
						$('#facebookShare').bind('mousedown',facebookShare);
						$('#googleShare').bind('mousedown',googleShare);
						$('#twitterShare').bind('mousedown',twitterShare);
						
						
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
					
					
					function facebookShare() {
						javascript:void window.open('http://www.facebook.com/sharer/sharer.php?t=ThreeDaFace&image=http://pdfstorage.mta.ac.il:8081/ThreeDaFace/upload?getoldthumb='+getFileName()+'&u=http://pdfstorage.mta.ac.il:8081/ThreeDaFace/myFaceShow.html?fileName='+getFileName() );
						return false;
					}
					
					function googleShare() {
						javascript:void window.open('https://plus.google.com/share?url=http://pdfstorage.mta.ac.il:8081/ThreeDaFace/myFaceShow.html?fileName='+getFileName() );
						return false;
					}
					
					function twitterShare() {
						javascript:void window.open('https://twitter.com/intent/tweet?source=webclient&text=ThreeDaFace&url=http://pdfstorage.mta.ac.il:8081/ThreeDaFace/myFaceShow.html?fileName='+getFileName() );
						return false;
					}
					
					function getFileName() {
						var urlQuery = location.search;
						urlQuery = urlQuery.replace('?', '');
						var split = urlQuery.split('=');

						return split[1];
					}
					
					
					
					// Inits the new slider design.
					function initNewUiControls() {
						
					 $.support.touch = 'ontouchend' in document;
							
					
					 if (!$.support.touch) {
							//Inits the select box.
							$("#modeSelect").selectbox({
								onChange: function (val, inst) {
									    textureMode= val;
							            $('#ajaxBusy').show();
							            $('#modeSelect').attr("disabled", "disabled");
							            
							          	var urlQuery = location.search;
										urlQuery = urlQuery.replace('?', '');
										var split = urlQuery.split('=');
	
										var fileName = split[1];
										
										modelIsReady = false;
										isModeCahge = true;
										cameraPosition = camera.position;
										meshMatrix = mesh.matrix;
										
										updateSceneData(fileName,scaleSize,val);
										
	//									updateData(sceneData);
										
										
								},effect:'fade'
							});
						} else {
							 $("select").change(function () {
						          var mode = "";
						          $("select option:selected").each(function () {
						        	  mode = $(this).attr('value');
						              });
						          	textureMode= mode;
						          
						            $('#ajaxBusy').show();
						            $('#modeSelect').attr("disabled", "disabled");
						            
						          	var urlQuery = location.search;
									urlQuery = urlQuery.replace('?', '');
									var split = urlQuery.split('=');
	
									var fileName = split[1];
									
									updateSceneData(fileName,scaleSize,mode);
									
						        });
						}
							
						//Hide the Tooltip at first
						tooltip.hide();
						
						// Add the minimum/maximum position value of range.
						var minimumSliderValue = 1;
						var currentSliderValue = 3;
						var maximumSliderValue = 20;
						
						// declare the minimum position of the tooltip according to its css.
						tooltip.text(currentSliderValue);
						tooltip.parent().append('<div id="tooltipMinPos"></div>');
						
						//set the value of the tooltip min pos.
						var min_pos = parseInt(slider.position().left, 10) + (slider.width()/2) - (tooltip.width()/2);
						
						// sets the left position of the tooltip according to the slider right pos.
						tooltip.css('left', min_pos);
						
						$("#tooltipMinPos").data('value', min_pos);
																		
						//Call the Slider
						slider.slider({
							//Config
							range: "min",
							min: minimumSliderValue,
							value: 3,
							max: maximumSliderValue,

							start: function(event,ui) {
							    tooltip.fadeIn('fast');
							},

							//Slider Event
							slide: function(event, ui) { //When the slider is sliding
								var pos_value = $("#tooltipMinPos").data('value');
											
								//Adjust the tooltip accordingly
								tooltip.css('left', pos_value).text(ui.value);
							},

							stop: function(event,ui) {
							    tooltip.fadeOut('fast');
							},
						});				
					}// end initNewUiControls().
					
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
