import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import localImages from '../data/localImages';
import './Gallery.css';

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const allImages = [...localImages.products, ...localImages.additional];

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(allImages[index]);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const newIndex = (currentIndex + 1) % allImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  const prevImage = () => {
    const newIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  return (
    <div className="gallery-section">
      <div className="container">
        <h2 className="section-title">Our Work Gallery</h2>
        <p className="section-subtitle">
          Explore our collection of premium granite and temple stone creations
        </p>

        <div className="gallery-grid">
          {allImages.map((image, index) => (
            <div 
              key={index} 
              className="gallery-item"
              onClick={() => openLightbox(index)}
            >
              <img src={image} alt={`VKTN Granites Work ${index + 1}`} />
              <div className="gallery-overlay">
                <span>View Image</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <X size={32} />
          </button>
          
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
            <ChevronLeft size={32} />
          </button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="VKTN Granites Work" />
            <p className="lightbox-counter">{currentIndex + 1} / {allImages.length}</p>
          </div>
          
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Gallery;
