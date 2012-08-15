package org.my.image.servlets;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.my.image.app.FaceDataManager;

import sun.misc.BASE64Decoder;

/**
 * Servlet implementation class UploadImage
 */
public class UploadImage extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
    
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		System.out.println("in UploadImage");
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);
		System.out.println("request: ");
		
		
		if (!isMultipart) {
		//	handleNotMultipart(request);
			
			String imageBase64 = request.getParameter("image2");
			
			imageBase64 = imageBase64.replaceFirst("data:image/png;base64,", "");
			
	        BASE64Decoder decoder = new BASE64Decoder();
	        byte[] decodedBytes = decoder.decodeBuffer(imageBase64);
	        System.out.println("Decoded upload data : " + decodedBytes.length);
	 
	 
	         BufferedImage image = ImageIO.read(new ByteArrayInputStream(decodedBytes));
	         if (image == null) {
	        	 System.out.println("Buffered Image is null");
	          }
	         File f = cerateNewFile("webCam.png");
	 
	         // write the image
	          ImageIO.write(image, "png", f);
	          
	          System.out.println(f.getName());
	          response.getWriter().print(f.getName());
			
		} else {
			FileItemFactory factory = new DiskFileItemFactory();
			ServletFileUpload upload = new ServletFileUpload(factory);
			List<?> items = null;

			try {
				items = upload.parseRequest(request);
				System.out.println("items: " + items);
			} catch (org.apache.commons.fileupload.FileUploadException e) {
				e.printStackTrace();
			}
			
			Iterator<?> itr = items.iterator();
			while (itr.hasNext()) {
				FileItem item = (FileItem) itr.next();
				if (item.isFormField()) {
					String name = item.getFieldName();
					System.out.println("name: " + name);
					String value = item.getString();
					System.out.println("value: " + value);
				} else {
					try {
						String itemName = item.getName();
						
						
						File savedFile = cerateNewFile(itemName);
						
						item.write(savedFile);
						
						response.sendRedirect("myFaceShow.html?fileName=" + savedFile.getName());
					} catch (Exception e) {
						e.printStackTrace();
					} catch (Throwable e) {
						e.printStackTrace();
					}
				}
			}
		}
		
	}
	
	private File cerateNewFile(String itemName) throws IOException {
		
		Random generator = new Random();
		int r = Math.abs(generator.nextInt());

		String reg = "[.*]";
		String replacingtext = "";
		System.out.println("Text before replacing is:-"
				+ itemName);
		Pattern pattern = Pattern.compile(reg);
		Matcher matcher = pattern.matcher(itemName);
		StringBuffer buffer = new StringBuffer();

		while (matcher.find()) {
			matcher.appendReplacement(buffer, replacingtext);
		}
		int IndexOf = itemName.indexOf(".");
		String domainName = itemName.substring(IndexOf);
		System.out.println("domainName: " + domainName);

		String finalimage = buffer.toString() + "_" + r
				+ domainName;
		System.out.println("Final Image===" + finalimage);
		
		
		String realPath = getServletContext().getRealPath("images");
		
		if(!FaceDataManager.isInit()) {
			FaceDataManager.init(realPath);
		}
		
		String fileFullName =  realPath + File.separator + "textures" + File.separator + finalimage;
		System.out.println(fileFullName);
		
		return new File(fileFullName);
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String imageurl = request.getParameter("imageurl");
		
		System.out.println("imageurl " + imageurl); 
		
		if(imageurl != null) {
			
			
			File savedFile = saveImage(imageurl, "chrome.png");
			
			response.sendRedirect("myFaceShow.html?fileName=" + savedFile.getName());
		}
	
	}
	
	public File saveImage(String imageUrl, String destinationFile) throws IOException {
		
		File newFile = cerateNewFile(destinationFile);
		URL url = new URL(imageUrl);
		InputStream is = url.openStream();
		OutputStream os = new FileOutputStream(newFile);

		byte[] b = new byte[2048];
		int length;

		while ((length = is.read(b)) != -1) {
			os.write(b, 0, length);
		}

		is.close();
		os.close();
		
		return newFile;
	}
	
}