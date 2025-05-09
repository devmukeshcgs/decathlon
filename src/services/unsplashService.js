// src/services/unsplashService.js

// LocalStorage keys
const UNSPLASH_CACHE_KEY = 'unsplash_photos_cache';
const CACHE_EXPIRY_KEY = 'unsplash_cache_expiry';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours cache

export const fetchImages = async (numOfImg) => {
    try {
        // Check if cached data exists and is still valid
        const cachedData = localStorage.getItem(UNSPLASH_CACHE_KEY);
        const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
        const now = new Date().getTime();

        if (cachedData && cacheExpiry && now < parseInt(cacheExpiry)) {
            // Use cached data
            return JSON.parse(cachedData);
        }

        const response = await fetch(
            `https://api.unsplash.com/photos/random?count=${numOfImg}&client_id=vCptQPrXejSAM_Ef5tmQyTB6DgvYF1dLhdK0QLA5-L0`
        );
        const data = await response.json();
        console.log(data);
        const photosData = data.map(img => ({
            id: img.id,
            url: img.urls.regular,
            thumbUrl: img.urls.thumb,
            alt: img.alt_description || 'Unsplash image'
        }));

        // Save to cache with expiry time
        localStorage.setItem(UNSPLASH_CACHE_KEY, JSON.stringify(photosData));
        localStorage.setItem(CACHE_EXPIRY_KEY, (now + CACHE_DURATION_MS).toString());

        return photosData;
    } catch (error) {
        console.error('Error fetching images:', error);
        throw error; // Re-throw the error to handle it in the component
    }
};