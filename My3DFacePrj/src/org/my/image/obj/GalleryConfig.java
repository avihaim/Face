package org.my.image.obj;

import java.util.List;

public class GalleryConfig {
	
	private boolean isConstant = true;
	
	private List<String> galleryImages = null;
	
	public GalleryConfig() {
	}

	public GalleryConfig(boolean isConstant, List<String> galleryImages) {
		super();
		this.isConstant = isConstant;
		this.galleryImages = galleryImages;
	}

	public boolean isConstant() {
		return isConstant;
	}

	public void setConstant(boolean isConstant) {
		this.isConstant = isConstant;
	}

	public List<String> getGalleryImages() {
		return galleryImages;
	}

	public void setGalleryImages(List<String> galleryImages) {
		this.galleryImages = galleryImages;
	}
	
}
