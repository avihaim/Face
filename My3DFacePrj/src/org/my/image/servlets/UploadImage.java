package org.my.image.servlets;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.URL;
import java.util.Arrays;
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
import org.apache.commons.io.IOUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.my.image.app.FaceDataManager;
import org.my.image.app.ImageUtil;
import org.my.image.exceptions.BadFileException;

import sun.misc.BASE64Decoder;

/**
 * Servlet implementation class UploadImage
 */
public class UploadImage extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static Random generator = new Random();
	private static ObjectMapper mapper = new ObjectMapper();
	
    
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		System.out.println("in UploadImage");
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);
		System.out.println("request: ");
		
		
		if (!isMultipart) {
		//	handleNotMultipart(request);
			
			
			StringWriter writer = new StringWriter();
			IOUtils.copy(request.getInputStream(), writer);
			String imageBase64 = writer.toString();

			imageBase64 = imageBase64.replaceFirst("data:image/png;base64,", "");
			
	        BASE64Decoder decoder = new BASE64Decoder();
	        byte[] decodedBytes = decoder.decodeBuffer(imageBase64);
	        System.out.println("Decoded upload data : " + decodedBytes.length);
	 
	 
	         BufferedImage image = ImageIO.read(new ByteArrayInputStream(decodedBytes));
	         if (image == null) {
	        	 System.out.println("Buffered Image is null");
	          }
	         File f;
			try {
				 f = cerateNewFile("webCam.png");
				// write the image
		          ImageIO.write(image, "png", f);
		          
		          System.out.println(f.getName());
		          
		          PrintWriter writer1 = response.getWriter();
				  
				  writer1.write(f.getName());
				  writer1.close();
			} catch (BadFileException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	 
	         
//				response.setStatus(HttpServletResponse.SC_OK);
//	          response.sendRedirect("myFaceShow.html?fileName=" + f.getName());
			  
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
			
			PrintWriter writer = response.getWriter();
			response.setContentType("application/json");
			
			
			ArrayNode json = mapper.createArrayNode();
			
			Iterator<?> itr = items.iterator();
			while (itr.hasNext()) {
				FileItem item = (FileItem) itr.next();
				
				ObjectNode jsono = mapper.createObjectNode();
				
					try {
						String itemName = item.getName();
						
						
						File savedFile = cerateNewFile(itemName);
						
						item.write(savedFile);
						
						jsono.put("name", savedFile.getName());
						jsono.put("id", generator.nextLong());
						jsono.put("size", item.getSize());
						jsono.put("url", "upload?getfile=" + savedFile.getName());
						jsono.put("thumbnail_url",
								"upload?getthumb=" + savedFile.getName());
						jsono.put("delete_url", "upload?delfile=" + savedFile.getName());
						jsono.put("delete_type", "GET");
						json.add(jsono);
					} catch (BadFileException e) {
						jsono.put("error", e.getMessage());
						json.add(jsono);
					} catch (Exception e) {
						e.printStackTrace();
					} finally {
						
						mapper.writeValue(response.getWriter(),json);
						writer.close();
					}
				}
		}
		
	}
	
	private File cerateNewFile(String itemName) throws BadFileException {
		
		
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
		
		ImageUtil.isImage(domainName);

		String finalimage = buffer.toString() + "_" + r
				+ domainName;
		System.out.println("Final Image===" + finalimage);
		
		String fileFullName =  FaceDataManager.IMAGES_PATH + File.separator + "textures" + File.separator + finalimage;
		System.out.println(fileFullName);
		
		return new File(fileFullName);
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String imageurl = request.getParameter("imageurl");
		
		if(imageurl != null) {
			
			File savedFile = null;
			try {
				savedFile = saveImage(imageurl, "chrome.png");
			} catch (BadFileException e) {
				e.printStackTrace();
			}
			
			response.sendRedirect("myFaceShow.html?fileName=" + savedFile.getName());
		}
	
	}
	
	public File saveImage(String imageUrl, String destinationFile) throws IOException, BadFileException {
		
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