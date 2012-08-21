package org.my.image.app;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageOutputStream;

import org.my.image.obj.FaceData;
import org.my.image.obj.FaceImage;

public class ImageDepthServices {
	
	public static int[] createImageDepth(BufferedImage img, BufferedImage imgD,
			int facePosX, int facePosY) {
		int[] pixelData;
		
		
		int facePosTopY = facePosY + imgD.getHeight(); 
		int facePosTopX = facePosX + imgD.getWidth();

		int[] rgb;
		pixelData = new int[img.getHeight() * img.getWidth()];
		
		List<Integer> list = new ArrayList<Integer>();
		
		
		int minZ = 300 * 10;

		for (int i = 0; i < img.getWidth() ; i++) {

			for (int j = 0; j < img.getHeight(); j++) {
				
				// If we in the face rectangle
				if (((facePosY <= j) && (facePosTopY > j))
						&& ((facePosX <= i) && (facePosTopX > i))) {

					// Get the Depth data for the pixel
					rgb = getPixelData(imgD, i - facePosX, j - facePosY);
					int picxlZ = rgb[0];
					
					if (picxlZ > 0) {

						if (minZ > picxlZ) {
							minZ = picxlZ;
						}
						
						// add to list all pixel data That are more the zero
						// we need it for the Median
						list.add(picxlZ);
					}
					
					pixelData[j * img.getWidth() + i] = picxlZ;
					

				} else {
					pixelData[j * img.getWidth() + i] = 0;
				}

			}
			

		}
		
		
		int median = median(list);

		System.out.println("median " + median);
		System.out.println("minz " + minZ);

		// Subtract the median from all pixels more the zero
		// and add the the min pixel value*40
		for (int j = 0; j < pixelData.length; j++) {
			if (pixelData[j] > 0) {
				pixelData[j] = pixelData[j] - median + minZ*40 ;//median ;//+ minZ;//((avg + minZ) * 4 + 30);
			}
		}
		return pixelData;
	}
	
	public static void createImageDepthAsStrem(FaceData fileNameD, ImageOutputStream imageOutputStream) throws IOException {
		String fileNameTexture = fileNameD.getImageNameRealPath();
		String fullFileNameD = fileNameD.getdImageNameRealPath();
		
		BufferedImage image = ImageIO.read(new File(fileNameTexture));
		BufferedImage imageDepth = ImageIO.read(new File(fullFileNameD));
		
		createImageDepthAsStrem(image, imageDepth, fileNameD.getFacePosX(), fileNameD.getFacePosY(), imageOutputStream);
	}
	
	public static BufferedImage createImageDepthAsStrem(BufferedImage img,
			BufferedImage imgD, int facePosX, int facePosY, ImageOutputStream imageOutputStream ) throws IOException {
		
		BufferedImage newImage = new BufferedImage(img.getWidth(), img.getHeight(), imgD.getType());
		
		int facePosTopY = facePosY + imgD.getHeight(); 
		int facePosTopX = facePosX + imgD.getWidth(); 

		int rgb;
		
		for (int i = 0; i < img.getWidth() ; i++) {

			for (int j = 0; j < img.getHeight(); j++) {
				if (((facePosY <= j) && (facePosTopY > j))
						&& ((facePosX <= i) && (facePosTopX > i))) {

					rgb = imgD.getRGB(i - facePosX, j - facePosY);
					newImage.setRGB(i, j, rgb);
					

				} else {
					newImage.setRGB(i, j, 0);
				}

			}

		}
		
		ImageIO.write(newImage, "png", imageOutputStream);
		
		return newImage;
	}
	
	public static int[] getImageRgb(BufferedImage img) {

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
					pixelData[counter + 3] = 255;
 
					counter += 4;
				}
			}

		} catch (Exception e) {
			System.out.println(counter);
			e.printStackTrace();
		}

		return pixelData;
	}

	public static int[] createSingleColorImage(BufferedImage img) {

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
						pixelData[counter + 3] = 255;
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
	
	public static int[] createSingleToningImage(BufferedImage img) {

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
						pixelData[counter + 3] = 255;
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
	
	public static int[] createGrayImage(BufferedImage img) {

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
					pixelData[counter + 3] = 255;

					counter += 4;
				}
			}

		} catch (Exception e) {
			System.out.println(counter);
			e.printStackTrace();
		}

		return pixelData;
	}

	public static int[] getPixelData(BufferedImage img, int x, int y) {
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
	
	public static FaceImage handleSingleToning(FaceData fileNameD)
			throws IOException {
		FaceImage faceImage;
		String fullFileNameD = fileNameD.getdImageNameRealPath();//getServletContext().getRealPath(fileNameD.getdImageName());
		
		BufferedImage imgD = ImageIO.read(new File(fullFileNameD));
		int[] texture = ImageDepthServices.createSingleToningImage(imgD);
		int[] depth = ImageDepthServices.createImageDepth(imgD, imgD, 0, 0);
		
		faceImage = new FaceImage(texture, depth, imgD.getHeight(),
				imgD.getWidth());
		return faceImage;
	}

	public static FaceImage handleSingleColor(FaceData fileNameD)
			throws IOException {
		FaceImage faceImage;
		String fullFileNameD = fileNameD.getdImageNameRealPath();//getServletContext().getRealPath(fileNameD.getdImageName());
		
		BufferedImage imgD = ImageIO.read(new File(fullFileNameD));
		int[] texture = ImageDepthServices.createSingleColorImage(imgD);
		int[] depth = ImageDepthServices.createImageDepth(imgD, imgD, 0, 0);
		
		faceImage = new FaceImage(texture, depth, imgD.getHeight(),
				imgD.getWidth());
		return faceImage;
	}

	public static FaceImage handleGray(FaceData fileNameD)
			throws IOException {
		FaceImage faceImage;
		String fullFileNameD = fileNameD.getdImageNameRealPath();//getServletContext().getRealPath(fileNameD.getdImageName());
		
		BufferedImage imgD = ImageIO.read(new File(fullFileNameD));
		int[] texture = ImageDepthServices.createGrayImage(imgD);
		int[] depth = ImageDepthServices.createImageDepth(imgD, imgD, 0, 0);
		
		faceImage = new FaceImage(texture, depth, imgD.getHeight(),
				imgD.getWidth());
		return faceImage;
	}

	public static FaceImage handleRGB(FaceData fileNameD) throws IOException {
		BufferedImage img;
		
		// Get the image (texture) full path
		String fileName = fileNameD.getImageNameRealPath();
		System.out.println(fileName);
		
		// Read the image
		img = ImageIO.read(new File(fileName));

		// Convert the texture to array
		int[] texture = ImageDepthServices.getImageRgb(img);
		
		// Convert the Depth to array by matching to texture
		int[] depth = getImageDepthForTexture(img, fileNameD);
		
		return new FaceImage(texture, depth, img.getHeight(),img.getWidth());
	}

	public static int[] getImageDepthForTexture(BufferedImage img, FaceData fileNameD) {

		BufferedImage imgD = null;
		int[] pixelData = null;

		try {
			
			// Get the image (Depth) full path
			String fullFileNameD = fileNameD.getdImageNameRealPath();//getServletContext().getRealPath(fileNameD.getdImageName());
			System.out.println(fullFileNameD);
			
			// Read the image
			imgD = ImageIO.read(new File(fullFileNameD));

			int facePosX = fileNameD.getFacePosX();
			int facePosY = fileNameD.getFacePosY();
			
			// Convert the Depth to array by matching to texture
			pixelData = ImageDepthServices.createImageDepth(img, imgD, facePosX, facePosY);

		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return pixelData;
	}

}
