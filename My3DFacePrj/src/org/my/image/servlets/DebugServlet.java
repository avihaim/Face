package org.my.image.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class DebugServlet
 */
public class DebugServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DebugServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		
		String javaPath = System.getProperty("catalina.base");
		response.getWriter().println(javaPath);
	//	String[] split = javaPath.split(";");
		
		
//		response.getWriter().println("javaPath : ");
//		for (String string : split) {
//			response.getWriter().println(string);
//		}
//		
//		response.getWriter().println("==========================================");
		
//		
//		if(newPath != null) {
//			
//			javaPath = javaPath.trim() + ";" + newPath;
//			
//			System.setProperty("java.library.path", javaPath);
//			
//			javaPath = System.getProperty("java.library.path");
//			
//			split = javaPath.split(";");
//			
//			response.getWriter().println("javaPath : ");
//			for (String string : split) {
//				response.getWriter().println(string);
//			}
//		}
		
		
//		
//		try {
//		String realPath = getServletContext().getRealPath("images");
//		response.getWriter().println(realPath);
//		
//		FaceDataManager.init(realPath);
//		
//		response.getWriter().println(FaceDataManager.getAllFaceData());
//		
//		} catch (Exception e) {
//			e.printStackTrace(response.getWriter());
//		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.getWriter().print("doPost");
	}

}
