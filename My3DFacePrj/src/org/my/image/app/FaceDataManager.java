package org.my.image.app;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.my.image.obj.FaceData;

public class FaceDataManager {

	public static String IMAGES_PATH = "D:\\java\\workspaces\\opencv\\MyProj\\WebContent\\images";
	private static Map<String, FaceData> imageMap = null;
	private static List<FaceData> imageList;

	public static void init(String path) throws IOException {

		IMAGES_PATH = path;
		imageMap = new HashMap<String, FaceData>();
		imageList = new ArrayList<FaceData>();
		
		File folder = new File(path+"/textures");
		File[] listOfFiles = folder.listFiles();

		for (File file : listOfFiles) {
			if (file.isFile()) {
				String imageName = "";
				try {
					imageName = file.getName();
					System.out.println(imageName);
					
					int[] extractFacePosFile = extractFacePosFile(imageName);
					
					int x = extractFacePosFile[0];
					int y = extractFacePosFile[1];
					
					FaceData faceData = new FaceData(imageName, "images" + File.separator + "depths" + File.separator + "D_" + imageName, "thumbnails/t_" + imageName, IMAGES_PATH + File.separator + "textures" + File.separator + imageName, IMAGES_PATH + File.separator  + "depths" + File.separator + "D_" + imageName, IMAGES_PATH + File.separator + "thumbnails" + File.separator + "t_" + imageName,IMAGES_PATH, x, y, imageList.size());
					
					addFaceData(imageName, faceData);
				} catch (Exception e) {
					System.out.println(imageName);
					e.printStackTrace();
				}
			}
		}
		
	}
	
	public static int[] extractFacePosFile(String filesName) {
		
		int[] is = new int[2];
		String[] extractFacePosFile = extractFacePosFile(IMAGES_PATH, filesName);
		
		is[0] =  Integer.valueOf(extractFacePosFile[0].trim());
		is[1] =  Integer.valueOf(extractFacePosFile[1].trim());
		
		return is;
	}

	public static String[] extractFacePosFile(String path, String imageName) {
		
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

	public static FaceData getFaceData(String imageName) throws IOException {
		
		System.out.println("FaceDataManager start");
		
		FaceData faceData = imageMap.get(imageName);
		
		
		
		if(faceData == null) { 
			
			System.out.println("FaceDataManager - start to create new faceData for " + imageName);
			
			try {
				
				String makeDepthMap = MakeDepthMapWrapper.makeDepthMap(imageName,IMAGES_PATH + File.separator);
				
				System.out.println("FaceDataManager - makeDepthMap response is " + makeDepthMap);
				
				int[] extractFacePosFile = extractFacePosFile(imageName);
				
				int x = extractFacePosFile[0];
				int y = extractFacePosFile[1];
				System.out.println("y="+y);
				System.out.println("x="+x);
	//			
	//			BufferedImage resizeImage = resizeImage(ImageIO.read(new File(IMAGES_PATH + File.separator + "textures" + File.separator + imageName)), BufferedImage.TYPE_INT_ARGB);
	//			
	//			System.out.println(IMAGES_PATH + File.separator + "textures" + File.separator + imageName);
	//			System.out.println(IMAGES_PATH + File.separator + "thumbnails" + File.separator + "t_" + imageName);
	//			ImageIO.write(resizeImage, domainName, new File(IMAGES_PATH + File.separator + "thumbnails" + File.separator + "t_" + imageName)); 
				
				faceData = new FaceData(imageName, "images" + File.separator + "depths" + File.separator + "D_" + imageName, "thumbnails/t_" + imageName, IMAGES_PATH + File.separator + "textures" + File.separator + imageName, IMAGES_PATH + File.separator  + "depths" + File.separator + "D_" + imageName, IMAGES_PATH + File.separator + "thumbnails" + File.separator + "t_" + imageName,IMAGES_PATH, x, y, imageList.size());
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
	
//	private static BufferedImage resizeImage(BufferedImage originalImage, int type){
//		BufferedImage resizedImage = new BufferedImage(50, 50, type);
//		Graphics2D g = resizedImage.createGraphics();
//		g.drawImage(originalImage, 0, 0, 50, 50, null);
//		g.dispose();
//	 
//		return resizedImage;
//	 }

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
	
	public static Map<String,FaceData> getAllFaceData() {
		return imageMap;
	}
	
	public static void addFaceData(String imageName, FaceData faceData) {
		
		if(faceData != null) {
			imageMap.put(imageName, faceData);
			imageList.add(faceData);
		}
	}
	
	public static boolean isInit() {
		return (imageMap != null);
		
	}

	public static int geSize() {
		return imageList.size();
	}

	// private static String appPath() {
	// java.net.URL r = ClassLoader.getSystemResource("my.html");
	// String filePath = r.getFile();
	// String result = new File(new File(new
	// File(filePath).getParent()).getParent()).getParent();
	//
	// return result;
	// }

}
