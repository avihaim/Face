package org.my.image.servlets;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;
import org.my.image.app.FaceDataManager;
import org.my.image.obj.FaceData;
import org.my.image.obj.SilderData;

/**
 * Servlet implementation class SliderManagerServlet
 */
public class SliderManagerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static ObjectMapper mapper = new ObjectMapper();
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SliderManagerServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String fromString = request.getParameter("from");
		String direction = request.getParameter("direction");
		
		// Fleg to client if there are some more imgaes in gallery 
		boolean isHaveMore = false;
		
		int from = Integer.parseInt(fromString);
		
		List<FaceData> allFaceData = null;
		
		// If the client ask to get previous resullt in gallery
		if("back".equals(direction)) {
			from -=15;
			
			// Is there are more imdags?
			if(from > 0) {
			//	System.out.println(from);
				isHaveMore = true;
			}
			
			// Is there are more imdags?
		} else if(from + 15 < FaceDataManager.geSize()) {
			
			isHaveMore = true;
		}
		
		// Get the gallery data
		allFaceData = FaceDataManager.getAllFaceData(from);
		
		// Write the gallery bake to client via json
		mapper.writeValue(response.getWriter(),new SilderData(allFaceData,isHaveMore) );
		
	}

}
