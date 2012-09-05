package org.my.image.app;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.my.image.obj.FaceData;
import org.my.image.obj.GalleryConfig;

public class FaceDataManager {

	public static String IMAGES_PATH = System.getProperty("catalina.base") + File.separator + "work_dir";
	private static Map<String, FaceData> imageMap = null;
	private static List<FaceData> imageList;
	private static GalleryConfig galleryConfig = null;
	private static ObjectMapper mapper = new ObjectMapper();
	private static boolean isGalleryConfigExsist = false;
	
	static {
		try {
			init();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private static void fillGalleryConfig() throws JsonGenerationException, JsonMappingException, IOException {
		List<String> imageNames = new ArrayList<>();
		
		for (FaceData faceData : imageList) {
			imageNames.add(faceData.getImageName());
		}
		
		GalleryConfig galleryConfigData = new GalleryConfig(true, imageNames);
		
		// Write the config file
		mapper.writeValue( new File(IMAGES_PATH+"/galleryConfig.json"), galleryConfigData);
		
		isGalleryConfigExsist = false;
	}
	
	private static void initGalleryConfig()  {
		File galleryConfigFile = new File(IMAGES_PATH+"/galleryConfig.json");
		
		try {
			// Read the config file
			// If the file is ot there or if is corrupt
			// we still run the gallery with all images
			galleryConfig = mapper.readValue(galleryConfigFile, GalleryConfig.class);
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		if(galleryConfig != null) {
			isGalleryConfigExsist = true;
		}
		
	}

	private static void init() throws IOException {

		// Read the Gallery config (the images names to display in the gallery)
		initGalleryConfig();
		
		imageMap = new HashMap<String, FaceData>();
		imageList = new ArrayList<FaceData>();
		
		// Load all the images from the textures folder
		File folder = new File(IMAGES_PATH+"/textures");
		File[] listOfFiles = folder.listFiles();

		for (File file : listOfFiles) {
			if (file.isFile()) {
				String imageName = "";
				try {
					imageName = file.getName();
					System.out.println(imageName);
					
					// Extract the position of the face in the image from file
					int[] extractFacePosFile = extractFacePosFile(imageName);
					
					int x = extractFacePosFile[0];
					int y = extractFacePosFile[1];
					
					FaceData faceData = new FaceData(imageName, "images" + File.separator + "depths" + File.separator + "D_" + imageName, "t_" + imageName, IMAGES_PATH + File.separator + "textures" + File.separator + imageName, IMAGES_PATH + File.separator  + "depths" + File.separator + "D_" + imageName, IMAGES_PATH + File.separator + "thumbnails" + File.separator + "t_" + imageName,IMAGES_PATH, x, y, imageList.size());
					
					// Save the image data in the list
					// All of the images will be available to view,
					// but only those in GalleryConfig will display in the gallery
					addFaceData(imageName, faceData);
				} catch (Exception e) {
					System.out.println(imageName);
					e.printStackTrace();
				}
			}
		}
		
		// If the config file is not exsist
		// We will create him with all of the images thet are available
		if(!isGalleryConfigExsist) {
			fillGalleryConfig();
		}
	}
	
	// Return the position of the face in the image
	public static int[] extractFacePosFile(String filesName) {
		
		int[] is = new int[2];
		String[] extractFacePosFile = extractFacePosFile(IMAGES_PATH, filesName);
		
		is[0] =  Integer.valueOf(extractFacePosFile[0].trim());
		is[1] =  Integer.valueOf(extractFacePosFile[1].trim());
		
		return is;
	}

	// Return a String from a file
	private static String[] extractFacePosFile(String path, String imageName) {
		
		String[] split = new String[2];
		
		try {
			
			int IndexOf = imageName.indexOf(".");
			String domainName = imageName.substring(IndexOf);
			
			File posFile = new File(path + "/facePos/" + imageName.replaceAll(domainName, ".pos"));

			
			FileInputStream fileInputStream = new FileInputStream(posFile);
			
			byte[] b = new byte[fileInputStream.available()];
			fileInputStream.read(b );
			String string = new String(b);
			split = string.split(",");
			fileInputStream.close();
		} catch (IOException e) {
			e.printStackTrace();
			split[0] = "1";
			split[0] = "2";
			
		}
		return split;
	}

	public static FaceData getOrCreateFaceData(String imageName) throws IOException {
		
		System.out.println("FaceDataManager start");
		
		
		FaceData faceData = imageMap.get(imageName);
		
		
		// If the file is already in the system
		// we dont whant to recreate hime
		if(faceData == null) { 
			
			System.out.println("FaceDataManager - start to create new faceData for " + imageName);
			
			try {
				// Call to ThreeDaFace dll to create the depth map
				String makeDepthMap = MakeDepthMapWrapper.makeDepthMap(imageName,IMAGES_PATH + File.separator);
				
				System.out.println("FaceDataManager - makeDepthMap response is " + makeDepthMap);
				
				int[] extractFacePosFile = extractFacePosFile(imageName);
				
				int x = extractFacePosFile[0];
				int y = extractFacePosFile[1];
			//	System.out.println("y="+y);
			//	System.out.println("x="+x);
			
				faceData = new FaceData(imageName, "images" + File.separator + "depths" + File.separator + "D_" + imageName, "t_" + imageName, IMAGES_PATH + File.separator + "textures" + File.separator + imageName, IMAGES_PATH + File.separator  + "depths" + File.separator + "D_" + imageName, IMAGES_PATH + File.separator + "thumbnails" + File.separator + "t_" + imageName,IMAGES_PATH, x, y, imageList.size());
				
				FaceDataManager.addFaceData(imageName, faceData );
			} catch (Exception e) {
				System.out.println("FaceDataManager Exception " + e.getMessage());
				e.printStackTrace();
			}
		} else {
			System.out.println("FaceDataManager - The faceData for " + imageName + " is " + faceData);
			
		}
		return faceData;
	}
	
	// Return 15 gallery images from request index
	public static List<FaceData> getAllFaceData(int fromIndex) {
		
		List<FaceData> subList = null;
		
		if(imageList != null) {
			
			int toIndex = fromIndex + 15;
			
			System.out.println("fromIndex " + fromIndex);
			System.out.println("imageList.size() " + imageList.size());
			
			if(toIndex > imageList.size()) {
				toIndex = imageList.size();
			}
			
			subList = imageList.subList(fromIndex, toIndex);
		}
		
		return subList;
	}
	
	// Return all available images
	public static Map<String,FaceData> getAllFaceData() {
		return imageMap;
	}
	
	public static void addFaceData(String imageName, FaceData faceData) {
		
		if(faceData != null) {
			imageMap.put(imageName, faceData);
			
			// Add to the gallery list only if:
			// 1. Gallery config is not exsist
			// 2. The gallery is NOT constant
			// 3. Image name is in the callery config
			if ((!isGalleryConfigExsist) || 
				(!galleryConfig.isConstant()) || 
				(galleryConfig.getGalleryImages().contains(imageName))) {
					
				imageList.add(faceData);
			} 
		}
	}
	
	public static boolean isInit() {
		return (imageMap != null);
		
	}

	public static int geSize() {
		return imageList.size();
	}

}
