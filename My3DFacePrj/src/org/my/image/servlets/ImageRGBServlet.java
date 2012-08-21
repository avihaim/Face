package org.my.image.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;
import org.my.image.app.FaceDataManager;
import org.my.image.app.ImageDepthServices;
import org.my.image.obj.FaceData;
import org.my.image.obj.FaceImage;

/**
 * Servlet implementation class ImageRGBServlet
 */
public class ImageRGBServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static ObjectMapper mapper = new ObjectMapper();

	/**
	 * Default constructor.
	 */
	public ImageRGBServlet() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		System.out.println("ImageRGBServlet start doGet");
		String fileName = request.getParameter("fileName");
		
		String mode = request.getParameter("mode");
		System.out.println("mode : " + mode);
		
		System.out.println(fileName);

		long currentTimeMillis = System.currentTimeMillis();
		
		System.out.println("ImageRGBServlet start to getFaceData for file " + fileName);
		
		// Get the model data
		FaceData fileNameD = FaceDataManager.getOrCreateFaceData(fileName);

		FaceImage faceImage = null;
				
		switch (mode) {
		case "rgb": // Normal mode
			faceImage = ImageDepthServices.handleRGB(fileNameD);
			break;
		case "gray":
			faceImage = ImageDepthServices.handleGray(fileNameD);
			break;
		case "singleColor":
			faceImage = ImageDepthServices.handleSingleColor(fileNameD);
			break;
		case "SingleToning":
			faceImage = ImageDepthServices.handleSingleToning(fileNameD);
			break;
		default:
			break;
		}
		
		mapper.writeValue(response.getWriter(),faceImage);
		long tolal = System.currentTimeMillis() - currentTimeMillis;
		
		System.out.println("Total time " + tolal);

	}

}
