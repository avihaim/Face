package org.my.image.servlets;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.my.image.app.FaceDataManager;
import org.my.image.obj.FaceData;
import org.my.image.obj.SilderData;

/**
 * Servlet implementation class SliderManagerServlet
 */
public class SliderManagerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
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
		boolean isHaveMore = false;
		
		int from = Integer.parseInt(fromString);
		
		
		
		
//		Map<String,FaceData> allFaceData = FaceDataManager.getAllFaceData();
		List<FaceData> allFaceData = null;
		
//		if(!FaceDataManager.isInit()) {
//			String realPath = getServletContext().getRealPath("images");
//		
//			FaceDataManager.init(realPath);
//		}
		
		if("back".equals(direction)) {
			from -=15;
			
			if(from > 0) {
				System.out.println(from);
				isHaveMore = true;
			}
		} else if(from + 15 < FaceDataManager.geSize()) {
			isHaveMore = true;
		}
		
		
		allFaceData = FaceDataManager.getAllFaceData(from);
		
//		JSONArray array = new JSONArray(allFaceData);
		
		
		
		JSONObject jsonObject = new JSONObject(new SilderData(allFaceData,isHaveMore)   );
		
		System.out.println(jsonObject);
		
		response.getWriter().print(jsonObject);
	}

}
