package org.my.image.obj;

public class FaceData {

	private String imageName = null;
	private String dImageName = null;
	private String thumName = null;
	
	private int facePosX = 0;
	private int facePosY = 0;
	private int pos = 0;
	
	public FaceData() {
	}
	
	public FaceData(String imageName,String dImageName, int facePosX, int facePosY,String thumName, int pos) {
		super();
		this.dImageName = dImageName;
		this.facePosX = facePosX;
		this.facePosY = facePosY;
		this.thumName = thumName;
		this.imageName = imageName;
		this.setPos(pos);
	}

	public String getdImageName() {
		return dImageName;
	}
	public void setdImageName(String dImageName) {
		this.dImageName = dImageName;
	}
	public int getFacePosX() {
		return facePosX;
	}
	public void setFacePosX(int facePosX) {
		this.facePosX = facePosX;
	}
	public int getFacePosY() {
		return facePosY;
	}
	public void setFacePosY(int facePosY) {
		this.facePosY = facePosY;
	}

	public String getThumName() {
		return thumName;
	}

	public void setThumName(String thumName) {
		this.thumName = thumName;
	}

	@Override
	public String toString() {
		return "FaceData [dImageName=" + dImageName + ", thumName=" + thumName
				+ ", facePosY=" + facePosX + ", facePosX=" + facePosY + "]";
	}

	public String getImageName() {
		return imageName;
	}

	public void setImageName(String imageName) {
		this.imageName = imageName;
	}

	public int getPos() {
		return pos;
	}

	public void setPos(int pos) {
		this.pos = pos;
	}
}
