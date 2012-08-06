package org.my.image.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.my.image.app.FaceDataManager;

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

		response.getWriter().println("doGet");
		
		try {
		String realPath = getServletContext().getRealPath("images");
		response.getWriter().println(realPath);
		
		FaceDataManager.init(realPath);
		
		response.getWriter().println(FaceDataManager.getAllFaceData());
		
		} catch (Exception e) {
			e.printStackTrace(response.getWriter());
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.getWriter().print("doPost");
	}

}
