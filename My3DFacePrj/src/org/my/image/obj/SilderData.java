package org.my.image.obj;

import java.util.List;


public class SilderData {
	
	List<FaceData> allFaceData = null;
	boolean haveMore = false;
	
	public SilderData(List<FaceData> allFaceData, boolean haveMore) {
		super();
		this.allFaceData = allFaceData;
		this.haveMore = haveMore;
	}
	public List<FaceData> getAllFaceData() {
		return allFaceData;
	}
	public void setAllFaceData(List<FaceData> allFaceData) {
		this.allFaceData = allFaceData;
	}
	public boolean isHaveMore() {
		return haveMore;
	}
	public void setHaveMore(boolean haveMore) {
		this.haveMore = haveMore;
	}

}
