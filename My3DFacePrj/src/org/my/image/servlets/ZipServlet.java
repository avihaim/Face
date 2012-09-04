package org.my.image.servlets;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;

import javax.imageio.stream.FileImageOutputStream;
import javax.imageio.stream.ImageOutputStream;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.my.image.app.FaceDataManager;
import org.my.image.app.ImageDepthServices;
import org.my.image.app.Zip;
import org.my.image.obj.FaceData;

/**
 * Servlet implementation class ZipServlet
 */
public class ZipServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ZipServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String fileName = request.getParameter("fileName");
		
		zipImageData(response, fileName);
		
	}

	private void zipImageData(HttpServletResponse response, String fileName)
			throws IOException {
		
//		if (!FaceDataManager.isInit()) {
//			FaceDataManager.init(getServletContext().getRealPath("images"));
//		}
		
		FaceData fileNameD = FaceDataManager.getOrCreateFaceData(fileName);
		
		String fileNameTexture = fileNameD.getImageNameRealPath();//getServletContext().getRealPath("images/textures/" + fileName);
		
		//String fullFileNameD = fileNameD.getdImageNameRealPath();// getServletContext().getRealPath(fileNameD.getdImageName());
		
		ImageOutputStream imageOutputStream = new FileImageOutputStream(new File("Depth_" + fileName));
		
		ImageDepthServices.createImageDepthAsStrem(fileNameD, imageOutputStream);
		String readme = getServletContext().getRealPath("/images/README");

		response.setContentType("application/zip");
		response.addHeader("Content-Disposition", "attachment; filename=imgaeData.zip");
		
		Zip.zip(response.getOutputStream(),
				Arrays.asList(
					fileNameTexture,
				//	fullFileNameD,
					"Depth_" + fileName,
					readme));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

}
