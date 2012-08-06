package org.my.image.app;

public class MakeDepthMapWrapper {
	
	static {
		System.loadLibrary("facedetect");
//		String property = System.getProperty("java.library.path");
//		
//		if(!property.contains(":/users/stud09co/avihaimo")) {
//			System.setProperty("java.library.path", property + ":/users/stud09co/avihaimo");
//		}----------------
//		
//		System.out.println(System.getProperty("java.library.path"));
//		System.loadLibrary("MyProj");
//		System.loadLibrary("org.my.image.servlets.MakeDepthMapWrapper");
	}
	
	public static native String makeDepthMap(String fileName,String resultPath);

}
