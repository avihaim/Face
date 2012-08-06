package org.my.image.servlets;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.my.image.app.FaceDataManager;
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
		BufferedImage img;

		long currentTimeMillis = System.currentTimeMillis();
		
		System.out.println("ImageRGBServlet start to FaceDataManager init");
		if (!FaceDataManager.isInit()) {
			FaceDataManager.init(getServletContext().getRealPath("images"));
		}
		
		System.out.println("ImageRGBServlet start to getFaceData for file " + fileName);
		FaceData fileNameD = FaceDataManager.getFaceData(fileName);

		FaceImage faceImage = null;
				
		if("rgb".equals(mode)) {
			faceImage = handleRGB(fileName, scaleSize, fileNameD);
		} else if("gray".equals(mode))  {
			String fullFileNameD = getServletContext().getRealPath(fileNameD.getdImageName());
			
			BufferedImage imgD = ImageIO.read(new File(fullFileNameD));
			int[] texture = createGrayImage(imgD);
			int[] depth = createImageDepth(imgD, scaleSize, imgD, 0,0);
			
			faceImage = new FaceImage(texture, depth, imgD.getHeight(),
					imgD.getWidth());
			
		} else if("singleColor".equals(mode))  {
			String fullFileNameD = getServletContext().getRealPath(fileNameD.getdImageName());
			
			BufferedImage imgD = ImageIO.read(new File(fullFileNameD));
			int[] texture = createSingleColorImage(imgD);
			int[] depth = createImageDepth(imgD, scaleSize, imgD, 0,0);
			
			faceImage = new FaceImage(texture, depth, imgD.getHeight(),
					imgD.getWidth());
			
		} else if("SingleToning".equals(mode))  {
			String fullFileNameD = getServletContext().getRealPath(fileNameD.getdImageName());
			
			BufferedImage imgD = ImageIO.read(new File(fullFileNameD));
			int[] texture = createSingleToningImage(imgD);
			int[] depth = createImageDepth(imgD, scaleSize, imgD, 0,0);
			
			faceImage = new FaceImage(texture, depth, imgD.getHeight(),
					imgD.getWidth());
			
		}

		long tolal = System.currentTimeMillis() - currentTimeMillis;
		System.out.println("Total time " + tolal);

		JSONObject jsonObject = new JSONObject(faceImage);
		response.getWriter().print(jsonObject);

	}

	private FaceImage handleRGB(String fileName, int scaleSize,
			FaceData fileNameD) throws IOException {
		BufferedImage img;
		fileName = getServletContext().getRealPath("images/textures/" + fileName);
		System.out.println(fileName);
		img = ImageIO.read(new File(fileName));

		int[] texture = getImageRgb(img);
		
		int[] depth = getImageDepthForTexture(img, fileNameD,scaleSize);
		
		FaceImage faceImage = new FaceImage(texture, depth, img.getHeight(),
				img.getWidth());
		return faceImage;
	}

	private int[] getImageDepthForTexture(BufferedImage img, FaceData fileNameD, int scaleSize) {

		BufferedImage imgD = null;
		int[] pixelData = null;

		try {
			String fullFileNameD = getServletContext().getRealPath(fileNameD.getdImageName());
			System.out.println(fullFileNameD);
			imgD = ImageIO.read(new File(fullFileNameD));

			int facePosX = fileNameD.getFacePosX();
			int facePosY = fileNameD.getFacePosY();
			
			
			pixelData = createImageDepth(img, scaleSize, imgD, facePosX,facePosY);

		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return pixelData;
	}

	private int[] createImageDepth(BufferedImage img, int scaleSize,
			BufferedImage imgD, int facePosX, int facePosY) {
		int[] pixelData;
		
		
		int facePosTopY = facePosY + imgD.getHeight(); // 189;
		int facePosTopX = facePosX + imgD.getWidth(); // 385

		int[] rgb;
		pixelData = new int[img.getHeight() * img.getWidth()];
		
		List<Integer> list = new ArrayList<Integer>();
		
		
		int minZ = 300 * 10;

		for (int i = 0; i < img.getHeight(); i++) {

			for (int j = 0; j < img.getWidth(); j++) {
				if (((facePosY <= i) && (facePosTopY > i))
						&& ((facePosX <= j) && (facePosTopX > j))) {

					rgb = getPixelData(imgD, j - facePosX, i - facePosY);
					int picxlZ = rgb[0];
					
					if (picxlZ > 0) {
						picxlZ = picxlZ * scaleSize;

						if (minZ > picxlZ) {
							minZ = picxlZ;
						}
						
						list.add(picxlZ);
					}
					
					pixelData[i * img.getWidth() + j] = picxlZ;
					

				} else {
					pixelData[i * img.getWidth() + j] = 0;
				}

			}
			

		}
		
		
		int median = median(list);

		System.out.println("median " + median);
		System.out.println("minz " + minZ);

		for (int j = 0; j < pixelData.length; j++) {
			if (pixelData[j] > 0) {
				pixelData[j] = pixelData[j] - median + minZ*10 ;//median ;//+ minZ;//((avg + minZ) * 4 + 30);
			}
		}
		return pixelData;
	}
	
	private int[] getImageRgb(BufferedImage img) {

		int counter = 0;

		int[] pixelData = null;

		try {

			pixelData = new int[img.getHeight() * img.getWidth() * 4 + 1];
			int[] rgb;

			for (int i = 0; i < img.getHeight(); i++) {
				for (int j = 0; j < img.getWidth(); j++) {
					rgb = getPixelData(img, j, i);
					pixelData[counter + 0] = rgb[0];
					pixelData[counter + 1] = rgb[1];
					pixelData[counter + 2] = rgb[2];
					pixelData[counter + 4] = 0;

					counter += 4;
				}
			}

		} catch (Exception e) {
			System.out.println(counter);
			e.printStackTrace();
		}

		return pixelData;
	}
// http://localhost:8080/ThreeDaFace/myFaceShow.html?imgeName=a1.jpg	
	private int[] createSingleColorImage(BufferedImage img) {

		int counter = 0;

		int[] pixelData = null;

		try {

			pixelData = new int[img.getHeight() * img.getWidth() * 4 + 1];
			int[] rgb;

			for (int i = 0; i < img.getHeight(); i++) {
				for (int j = 0; j < img.getWidth(); j++) {
					rgb = getPixelData(img, j, i);
					
					if(rgb[0] > 0) {
						pixelData[counter + 0] = 255;
						pixelData[counter + 1] = 150;
						pixelData[counter + 2] = 54;
						pixelData[counter + 4] = 0;
					}

					counter += 4;
				}
			}

		} catch (Exception e) {
			System.out.println(counter);
			e.printStackTrace();
		}

		return pixelData;
	}
	
	private int[] createSingleToningImage(BufferedImage img) {

		int counter = 0;

		int[] pixelData = null;

		try {

			pixelData = new int[img.getHeight() * img.getWidth() * 4 + 1];
			int[] rgb;

			for (int i = 0; i < img.getHeight(); i++) {
				for (int j = 0; j < img.getWidth(); j++) {
					rgb = getPixelData(img, j, i);
					
					if(rgb[0] > 0) {
						pixelData[counter + 0] = 255;
						pixelData[counter + 1] = rgb[0];
						pixelData[counter + 2] = 255;
						pixelData[counter + 4] = 0;
					}

					counter += 4;
				}
			}

		} catch (Exception e) {
			System.out.println(counter);
			e.printStackTrace();
		}

		return pixelData;
	}
	
	private int[] createGrayImage(BufferedImage img) {

		int counter = 0;

		int[] pixelData = null;

		try {

			pixelData = new int[img.getHeight() * img.getWidth() * 4 + 1];
			int[] rgb;

			for (int i = 0; i < img.getHeight(); i++) {
				for (int j = 0; j < img.getWidth(); j++) {
					rgb = getPixelData(img, j, i);
					pixelData[counter + 0] = rgb[0];
					pixelData[counter + 1] = rgb[1];
					pixelData[counter + 2] = rgb[2];
					pixelData[counter + 4] = 0;

					counter += 4;
				}
			}

		} catch (Exception e) {
			System.out.println(counter);
			e.printStackTrace();
		}

		return pixelData;
	}

	private static int[] getPixelData(BufferedImage img, int x, int y) {
		// System.out.println("x=" + x + " y=" + y);
		int rgb[] = null;
		try {
			int argb = img.getRGB( x ,y );

			rgb = new int[] { (argb >> 16) & 0xff, // red
					(argb >> 8) & 0xff, // green
					(argb) & 0xff // blue
			};
		} catch (Exception e) {
			System.out.println("x= " + x + "y= " + y);
			// e.printStackTrace();

			rgb = new int[] { 0, // red
					0, // green
					0 }; // blue
		}

		// System.out.println("rgb: " + rgb[0] + " " + rgb[1] + " " + rgb[2]);
		return rgb;

	}

	public static int median(List<Integer> values) {
		
		Collections.sort(values);

		if (values.size() % 2 == 1)
			return values.get((values.size() + 1) / 2 - 1);
		else {
			int lower = values.get(values.size() / 2 - 1);
			int upper = values.get(values.size() / 2);

			return (lower + upper) / 2;
		}
	}
}
