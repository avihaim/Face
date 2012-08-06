package org.my.image.obj;

public class FaceImage {
	
	int[] texture;
	int[] depth;
	
	int height;
	int width;
	
	public FaceImage() {
	}
	public FaceImage(int[] texture, int[] depth, int height, int width) {
		super();
		this.texture = texture;
		this.depth = depth;
		this.height = height;
		this.width = width;
	}
	public int[] getTexture() {
		return texture;
	}
	public void setTexture(int[] texture) {
		this.texture = texture;
	}
	public int[] getDepth() {
		return depth;
	}
	public void setDepth(int[] depth) {
		this.depth = depth;
	}
	public int getHeight() {
		return height;
	}
	public void setHeight(int height) {
		this.height = height;
	}
	public int getWidth() {
		return width;
	}
	public void setWidth(int width) {
		this.width = width;
	}
	
	
}
