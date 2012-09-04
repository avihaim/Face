package org.my.image.app;

import java.util.Arrays;
import java.util.List;

import org.my.image.exceptions.BadFileException;

public class ImageUtil {
	private static List<String> imageTyps = Arrays.asList(".jpg",".png",".jpeg");
	
	public static void isImage(String domainName) throws BadFileException {
		if(!imageTyps.contains(domainName.toLowerCase())) {
			throw new BadFileException("This file type is not allow, only one of the follwing : " + imageTyps);
		}
	}
	
	public static boolean isFileIsImage(String imageName) {
		
		int IndexOf = imageName.indexOf(".");
		String domainName = imageName.substring(IndexOf);
		
		return imageTyps.contains(domainName.toLowerCase());
		
	}
}
