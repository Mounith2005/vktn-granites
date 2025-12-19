# VKTN Granites - Image Guide

## Current Images in `/public/images/` folder

### Available Images:
1. **unnamed.webp** (279KB) - Main hero/banner image
2. **unnamed (1).webp** (165KB) - Temple stone product
3. **unnamed (2).webp** (176KB) - Temple stone product
4. **unnamed (3).webp** (176KB) - Granite product
5. **unnamed (4).webp** (153KB) - Workshop/About page image
6. **jd-Ott_720x540_Thumbnail.0000004.jpg** (151KB) - Video thumbnail
7. **download.jpeg** (8.7KB) - Additional product
8. **download (1).jpeg** (11KB) - Additional product
9. **images.jpeg** (11KB) - Additional product
10. **unnamed.jpg** (14KB) - Additional image

---

## Image Usage in Website

### Home Page:
- **Hero Background**: `/images/unnamed.webp`
- **Gallery**: All 10 images displayed in grid

### About Page:
- **Company Story**: `/images/unnamed (4).webp`

### Gallery Component:
- Displays all product images in interactive grid
- Lightbox view for full-size images
- Navigation between images

---

## How to Add More Images

### Option 1: Download from JustDial
Visit: https://www.justdial.com/Namakkal/V-K-T-N-GRANITES-TEMPLE-STONES-Salem-To-Namakkal-Bypass-Road-Masakalipatti/9999P4286-4286-170623161838-Y7W1_BZDET/photos

1. Right-click on any image
2. Save as to: `F:\SEM 6\granite company\frontend\public\images\`
3. Use descriptive names like: `temple-stone-1.jpg`, `granite-statue-1.jpg`

### Option 2: Add Your Own Photos
1. Take photos of your products
2. Save to: `F:\SEM 6\granite company\frontend\public\images\`
3. Recommended format: `.webp` or `.jpg`
4. Recommended size: 1920x1080 or similar

### Option 3: Update Image References
After adding new images, update:
- `frontend/src/data/localImages.js`
- Add new image paths to appropriate arrays

---

## Image Naming Convention (Recommended)

For better organization, rename images to:
- `hero-banner.webp` - Main hero image
- `temple-stone-1.webp` - Temple stone products
- `temple-stone-2.webp`
- `granite-statue-1.webp` - Granite statues
- `granite-statue-2.webp`
- `workshop-1.jpg` - Workshop/facility photos
- `product-1.jpg` - General products
- `product-2.jpg`

---

## Current Image Mapping

```javascript
{
  hero: '/images/unnamed.webp',
  about: '/images/unnamed (4).webp',
  products: [
    '/images/unnamed.webp',
    '/images/unnamed (1).webp',
    '/images/unnamed (2).webp',
    '/images/unnamed (3).webp',
    '/images/unnamed (4).webp',
    '/images/jd-Ott_720x540_Thumbnail.0000004.jpg'
  ],
  additional: [
    '/images/unnamed.jpg',
    '/images/download.jpeg',
    '/images/download (1).jpeg',
    '/images/images.jpeg'
  ]
}
```

---

## Image Optimization Tips

1. **Format**: Use `.webp` for best compression (smaller file size)
2. **Size**: Resize large images to max 1920px width
3. **Quality**: 80-85% quality is usually sufficient
4. **File Size**: Keep under 500KB per image for fast loading

---

## Adding New Images - Step by Step

1. **Add image file** to `public/images/` folder
2. **Update** `src/data/localImages.js`:
   ```javascript
   products: [
     '/images/your-new-image.jpg',
     // ... existing images
   ]
   ```
3. **Save** and refresh browser
4. Image will appear in gallery automatically

---

## Need Help?

- All images in `public/images/` are automatically accessible
- Use path format: `/images/filename.ext`
- No import needed - just reference the path
- Images load from public folder at runtime

---

**Last Updated**: December 2025
