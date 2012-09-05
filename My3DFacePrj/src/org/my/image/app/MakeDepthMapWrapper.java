package org.my.image.app;

public class MakeDepthMapWrapper {
	
	static {
		System.loadLibrary("facedetect");
	}
	
	public static native String makeDepthMap(String fileName,String resultPath);

}
