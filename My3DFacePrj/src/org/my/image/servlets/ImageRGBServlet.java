package org.my.image.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.my.image.app.FaceDataManager;
import org.my.image.app.ImageDepthServices;
import org.my.image.obj.FaceData;
import org.my.image.obj.FaceImage;

/**
 * Servlet implementation class ImageRGBServlet
 */
public class ImageRGBServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	

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
		
		
		
		int scaleSize = 1;

//		String scaleSizeParameter = request.getParameter("scaleSize");
//		
//		if(scaleSizeParameter != null) {
//			scaleSize = Integer.parseInt(scaleSizeParameter);
//			System.out.println("scaleSize : " + scaleSize);
//		}
		
		System.out.println(fileName);

		long currentTimeMillis = System.currentTimeMillis();
		
		System.out.println("ImageRGBServlet start to FaceDataManager init");
//		if (!FaceDataManager.isInit()) {
//			FaceDataManager.init(getServletContext().getRealPath("images"));
//		}
		
		System.out.println("ImageRGBServlet start to getFaceData for file " + fileName);
		FaceData fileNameD = FaceDataManager.getFaceData(fileName);

		FaceImage faceImage = null;
				
		switch (mode) {
		case "rgb":
			faceImage = ImageDepthServices.handleRGB(scaleSize, fileNameD);
			break;
		case "gray":
			faceImage = ImageDepthServices.handleGray(scaleSize, fileNameD);
			break;
		case "singleColor":
			faceImage = ImageDepthServices.handleSingleColor(scaleSize, fileNameD);
			break;
		case "SingleToning":
			faceImage = ImageDepthServices.handleSingleToning(scaleSize, fileNameD);
			break;
		default:
			break;
		}
		
		long tolal = System.currentTimeMillis() - currentTimeMillis;
		System.out.println("Total time " + tolal);

		JSONObject jsonObject = new JSONObject(faceImage);
		response.getWriter().print(jsonObject);

	}

}
