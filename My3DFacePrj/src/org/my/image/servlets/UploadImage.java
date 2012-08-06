package org.my.image.servlets;

import java.awt.Image;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Random;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.my.image.app.FaceDataManager;

/**
 * Servlet implementation class UploadImage
 */
public class UploadImage extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private final static char[] ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".toCharArray();

    private static int[]  toInt   = new int[128];

    static {
        for(int i=0; i< ALPHABET.length; i++){
            toInt[ALPHABET[i]]= i;
        }
    }

    
	/**
     * Translates the specified Base64 string into a byte array.
     *
     * @param s the Base64 string (not null)
     * @return the byte array (not null)
     */
    public static byte[] decode(String s){
        int delta = s.endsWith( "==" ) ? 2 : s.endsWith( "=" ) ? 1 : 0;
        byte[] buffer = new byte[s.length()*3/4 - delta];
        int mask = 0xFF;
        int index = 0;
        for(int i=0; i< s.length(); i+=4){
            int c0 = toInt[s.charAt( i )];
            int c1 = toInt[s.charAt( i + 1)];
            buffer[index++]= (byte)(((c0 << 2) | (c1 >> 4)) & mask);
            if(index >= buffer.length){
                return buffer;
            }
            int c2 = toInt[s.charAt( i + 2)];
            buffer[index++]= (byte)(((c1 << 4) | (c2 >> 2)) & mask);
            if(index >= buffer.length){
                return buffer;
            }
            int c3 = toInt[s.charAt( i + 3 )];
            buffer[index++]= (byte)(((c2 << 6) | c3) & mask);
        }
        return buffer;
    } 
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		System.out.println("in UploadImage");
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);
		System.out.println("request: ");
		
		
		
		if (!isMultipart) {
			
			String imageBase64 = request.getParameter("image2");
			
			System.out.println(imageBase64);
			imageBase64 = imageBase64.replace("data:image/png;base64,", "");
			
			byte[] btDataFile = decode(imageBase64);  
			File of = new File("yourFile2.png");  
			FileOutputStream osf = new FileOutputStream(of);  
//			System.out.println(of.getAbsolutePath());
			System.out.println(imageBase64);
			for (int i = 0; i < btDataFile.length; i++) {
				System.out.print(btDataFile[i]);
			}

			osf.write(btDataFile);  
			osf.flush();  
			osf.close();
			
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
						response.getWriter().print("File uploaded successfully, New file name is " + finalimage);
						
						
						System.out.println(realPath + File.separator + "textures" + File.separator + finalimage);
						File savedFile = new File(realPath + File.separator + "textures" + File.separator + finalimage);
						item.write(savedFile);
						
						if(!FaceDataManager.isInit()) {
							FaceDataManager.init(realPath);
						}
						
						FaceDataManager.addFaceData(finalimage, null );

//						RequestDispatcher dispatcher = request.getRequestDispatcher("webgl_geometry_terrain.html");
//						dispatcher.forward(request, response);

						response.sendRedirect("myFaceShow.html?fileName=" + finalimage);
					} catch (Exception e) {
						e.printStackTrace();
					} catch (Throwable e) {
						e.printStackTrace();
					}
				}
			}
		}
	}
}