package org.my.image.app;

import java.io.File;
import java.util.Arrays;
import java.util.List;

import org.my.image.exceptions.BadFileException;

public class ImageUtil {
	private static List<String> imageTyps = Arrays.asList(".jpg",".png",".jpeg");
	
	// Check if the file is allowed file type 
	// throw BadFileException if not
	public static void isImage(String domainName) throws BadFileException {
		if(!imageTyps.contains(domainName.toLowerCase())) {
			throw new BadFileException("This file type is not allow, only one of the follwing : " + imageTyps);
		}
	}
	
	// Check if the file is allowed file type 
	public static boolean isFileIsImage(String imageName) {
		
		int IndexOf = imageName.indexOf(".");
		String domainName = imageName.substring(IndexOf);
		
		return imageTyps.contains(domainName.toLowerCase());
		
	}
	
	public static String getMimeType(File file) {
		String mimetype = "";
		if (file.exists()) {
			// URLConnection uc = new URL("file://" +
			// file.getAbsolutePath()).openConnection();
			// String mimetype = uc.getContentType();
			// MimetypesFIleTypeMap gives PNG as application/octet-stream, but
			// it seems so does URLConnection
			// have to make dirty workaround
			if (getSuffix(file.getName()).equalsIgnoreCase(".png")) {
				mimetype = "image/png";
			} else if (getSuffix(file.getName()).equalsIgnoreCase(".jpg")) {
				mimetype = "image/jpg";
			} else if (getSuffix(file.getName()).equalsIgnoreCase(".gif")) {
				mimetype = "image/gif";
			} else {
				javax.activation.MimetypesFileTypeMap mtMap = new javax.activation.MimetypesFileTypeMap();
				mimetype = mtMap.getContentType(file);
			}
		}
		//System.out.println("mimetype: " + mimetype);
		return mimetype;
	}

	public static String getSuffix(String filename) {
		String suffix = "";
		int pos = filename.lastIndexOf('.');
		if (pos > 0 && pos < filename.length() - 1) {
			suffix = filename.substring(pos);
		}
		//System.out.println("suffix: " + suffix);
		return suffix;
	}
}
