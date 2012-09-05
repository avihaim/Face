package org.my.image.app;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class Zip {
	static final int BUFFER = 2048;


	// Create a zip file with the all files in list 
	public static void zip(OutputStream dest,List<String> files) {
		
		
		try {
			BufferedInputStream origin = null;
			
			ZipOutputStream out = new ZipOutputStream(new BufferedOutputStream(dest));
			
			// out.setMethod(ZipOutputStream.DEFLATED);
			byte data[] = new byte[BUFFER];
			

			// Add eche file to the zip file
			for (String fileName : files) {
				File file = new File(fileName);
				System.out.println("Adding: " + fileName);
				InputStream fi = new FileInputStream(file);
				origin = new BufferedInputStream(fi, BUFFER);
				ZipEntry entry = new ZipEntry(file.getName());
				out.putNextEntry(entry);
				int count;
				while ((count = origin.read(data, 0, BUFFER)) != -1) {
					out.write(data, 0, count);
				}
				origin.close();
			}
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}