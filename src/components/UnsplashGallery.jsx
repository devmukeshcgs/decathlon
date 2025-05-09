import { useState, useEffect } from 'react';
import { createApi } from 'unsplash-js';

// Initialize the Unsplash API client
const unsplash = createApi({
  // accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY, // Replace with your actual key
  // Optional: you can add other configuration options here
});

function UnsplashGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Effect");
    
    const fetchPhotos = async () => {
      try {
        // Using the unsplash-js library methods
        const result = await unsplash.photos.getRandom({
          count: 10,
        });

        if (result.errors) {
          throw new Error(result.errors[0]);
        }

        setPhotos(result.response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="gallery">
      <h1>Unsplash Photos</h1>
      <div className="photo-grid">
        {Array.isArray(photos) ? (
          photos.map(photo => (
            <div key={photo.id} className="photo-item">
              <img
                src={photo.urls.regular}
                alt={photo.alt_description || 'Unsplash photo'}
              />
              <p className="attribution">
                Photo by <a href={`${photo.user.links.html}?utm_source=your_app_name&utm_medium=referral`}>
                  {photo.user.name}
                </a> on <a href="https://unsplash.com/?utm_source=your_app_name&utm_medium=referral">
                  Unsplash
                </a>
              </p>
            </div>
          ))
        ) : (
          // Handle case when only one photo is returned (non-array)
          <div className="photo-item">
            <img
              src={photos.urls.regular}
              alt={photos.alt_description || 'Unsplash photo'}
            />
            <p className="attribution">
              Photo by <a href={`${photos.user.links.html}?utm_source=your_app_name&utm_medium=referral`}>
                {photos.user.name}
              </a> on <a href="https://unsplash.com/?utm_source=your_app_name&utm_medium=referral">
                Unsplash
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UnsplashGallery;