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
		
		// print work_dir path.
		response.getWriter().println("work_dir : " + javaPath);
		
		// print new line.
		response.getWriter().println(" ");
		
		// print "java.library.path" paths.
		String classpath = System.getProperty("java.library.path");
		
		String[] split = classpath.split(";");
		
		response.getWriter().println("java.library.path : ");
		for (String string : split) {
			response.getWriter().println(string);
		}
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.getWriter().print("doPost");
	}

}
