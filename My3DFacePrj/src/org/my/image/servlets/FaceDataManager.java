package org.my.image.servlets;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FaceDataManager {

	public static String IMAGES_PATH = "D:\\java\\workspaces\\opencv\\MyProj\\WebContent\\images";
	private static Map<String, FaceData> imageMap = null;
	private static List<FaceData> imageList;

	static {

//		try {
//				init(IMAGES_PATH);
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
	}
		//
//		
//		imageMap.put("/textures/I4.jpg", new FaceData("/images/depths/DI4.png",
//				215, 18, "thumbnails/t_I4.jpg")); // x-10
//		imageMap.put("/textures/I2.jpg", new FaceData("/images/depths/DI2.png",
//				64, 73, "thumbnails/t_I2.jpg"));
//		imageMap.put("/textures/I3.jpg", new FaceData("/images/depths/DI3.png",
//				223, 83, "thumbnails/t_I3.jpg")); //
//		imageMap.put("/textures/I1.jpg", new FaceData("/images/depths/DI1.png",
//				94, 72, "thumbnails/t_I1.jpg")); // x-10

	public static void init(String path) throws IOException {

		IMAGES_PATH = path;
		imageMap = new HashMap<String, FaceData>();
		imageList = new ArrayList<FaceData>();
		
		File folder = new File(path+"/textures");
		File[] listOfFiles = folder.listFiles();
		int i = 0;

		for (File file : listOfFiles) {
			if (file.isFile()) {
				String filesName = "";
				try {
					filesName = file.getName();
					System.out.println(filesName);
					String[] split = extractFacePosFile(path, filesName);
					
					int x = Integer.valueOf(split[0].trim());
					int y = Integer.valueOf(split[1].trim());
					FaceData faceData = new FaceData(filesName,"/images/depths/D_" + filesName, y, x, "thumbnails/t_" + filesName,i);
					imageMap.put(filesName,faceData);
					imageList.add(faceData);
					i++;
				} catch (Exception e) {
					System.out.println(filesName);
					e.printStackTrace();
				}
			}
		}
	}

	private static String[] extractFacePosFile(String path, String filesName) {
		
		String[] split = new String[2];
		
		try {
			
			int IndexOf = filesName.indexOf(".");
			String domainName = filesName.substring(IndexOf);
			
			File posFile = new File(path + "/facePos/" + filesName.replaceAll(domainName, ".pos"));

			
			FileInputStream fileInputStream = new FileInputStream(posFile);
			
			byte[] b = new byte[fileInputStream.available()];
			fileInputStream.read(b );
			String string = new String(b);
			split = string.split(",");
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
		
		System.out.println("FaceDataManager faceData is " + faceData);
		
		if(faceData == null) { 
			try {
				System.out.println("FaceDataManager start to run makeDepthMap"); 
				
				String makeDepthMap = MakeDepthMapWrapper.makeDepthMap(imageName,IMAGES_PATH + File.separator);
				
				System.out.println("is " + makeDepthMap);
				
				String[] split = extractFacePosFile(IMAGES_PATH,imageName);
				
				int x =  Integer.valueOf(split[0].trim());
				int y =  Integer.valueOf(split[1].trim());
				System.out.println("y="+y);
				System.out.println("x="+x);
	//			
	//			BufferedImage resizeImage = resizeImage(ImageIO.read(new File(IMAGES_PATH + File.separator + "textures" + File.separator + imageName)), BufferedImage.TYPE_INT_ARGB);
	//			
	//			System.out.println(IMAGES_PATH + File.separator + "textures" + File.separator + imageName);
	//			System.out.println(IMAGES_PATH + File.separator + "thumbnails" + File.separator + "t_" + imageName);
	//			ImageIO.write(resizeImage, domainName, new File(IMAGES_PATH + File.separator + "thumbnails" + File.separator + "t_" + imageName)); 
				
				faceData = new FaceData(imageName,"/images/depths/D_" + imageName, x, y, "thumbnails/t_" + imageName,imageList.size());
				FaceDataManager.addFaceData(imageName, faceData );
				
			
			} catch (Exception e) {
				System.out.println("FaceDataManager Exception " + e.getMessage());
				e.printStackTrace();
			}
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
		imageMap.put(imageName, faceData);
		imageList.add(faceData);
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
