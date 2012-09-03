package org.my.image.obj;

public class FaceData implements Comparable<FaceData> {

	
	private String imageName = null;
	private String dImageName = null;
	private String thumName = null;
	
	private String imageNameRealPath = null;
	private String dImageNameRealPath = null;
	private String thumNameRealPath = null;

	private String realPath = null;

	private int facePosX = 0;
	private int facePosY = 0;
	private int pos = 0;
	private Long fileCerateTime = Long.valueOf(0);
	
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
	

	public FaceData(String imageName, String dImageName, String thumName,
			String imageNameRealPath, String dImageNameRealPath,
			String thumNameRealPath,String realPath, int facePosX, int facePosY, int pos, long fileCerateTime) {
		super();
		this.imageName = imageName;
		this.dImageName = dImageName;
		this.thumName = thumName;
		this.imageNameRealPath = imageNameRealPath;
		this.dImageNameRealPath = dImageNameRealPath;
		this.thumNameRealPath = thumNameRealPath;
		this.realPath = realPath;
		this.facePosX = facePosX;
		this.facePosY = facePosY;
		this.pos = pos;
		this.setFileCerateTime(fileCerateTime);
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
	
	public String getImageNameRealPath() {
		return imageNameRealPath;
	}

	public void setImageNameRealPath(String imageNameRealPath) {
		this.imageNameRealPath = imageNameRealPath;
	}

	public String getdImageNameRealPath() {
		return dImageNameRealPath;
	}

	public void setdImageNameRealPath(String dImageNameRealPath) {
		this.dImageNameRealPath = dImageNameRealPath;
	}

	public String getThumNameRealPath() {
		return thumNameRealPath;
	}

	public void setThumNameRealPath(String thumNameRealPath) {
		this.thumNameRealPath = thumNameRealPath;
	}

	public String getRealPath() {
		return realPath;
	}

	public void setRealPath(String realPath) {
		this.realPath = realPath;
	}

	@Override
	public int compareTo(FaceData o) {
		return o.getFileCerateTime().compareTo(this.getFileCerateTime());
	}

	public Long getFileCerateTime() {
		return fileCerateTime;
	}

	public void setFileCerateTime(Long fileCerateTime) {
		this.fileCerateTime = fileCerateTime;
	}

}
