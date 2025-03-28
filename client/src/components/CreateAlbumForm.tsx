import React, { useState } from 'react';
import { createAlbum } from '../lib/sanity-client';
import { useToast } from '../hooks/useToast';

// Define the categories available in the schema
const ALBUM_CATEGORIES = [
  { title: "Vacation", value: "vacation" },
  { title: "Date Night", value: "dateNight" },
  { title: "Anniversary", value: "anniversary" },
  { title: "First Meeting", value: "firstMeeting" },
  { title: "Holidays", value: "holidays" },
  { title: "Special Moments", value: "specialMoments" }
];

// Define the theme colors available in the schema
const THEME_COLORS = [
  { title: "Romantic Red", value: "#FF6B6B" },
  { title: "Passionate Pink", value: "#FF85A2" },
  { title: "Dreamy Lavender", value: "#C5A3FF" },
  { title: "Ocean Blue", value: "#45B3E0" },
  { title: "Forest Green", value: "#4CAF50" },
  { title: "Sunset Orange", value: "#FF9966" }
];

// Define visual effects
const VISUAL_EFFECTS = [
  { title: "Heart Frame", value: "heartFrame" },
  { title: "Soft Glow", value: "softGlow" },
  { title: "Vintage Filter", value: "vintageFilter" },
  { title: "Polaroid Style", value: "polaroid" },
  { title: "Floating Hearts", value: "floatingHearts" }
];

const CreateAlbumForm = ({ onClose, onCancel }: { onClose: () => void; onCancel?: () => void }) => {
  const { showToast } = useToast();

  // Basic album info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [sharedWithInput, setSharedWithInput] = useState('');

  // Advanced album features
  const [categories, setCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [location, setLocation] = useState({ lat: 0, lng: 0, address: '' });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [theme, setTheme] = useState({ 
    color: '', 
    font: '', 
    layout: 'grid' // default layout
  });
  const [effects, setEffects] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleAddSharedEmail = () => {
    if (sharedWithInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sharedWithInput)) {
      setSharedWith([...sharedWith, sharedWithInput]);
      setSharedWithInput('');
    } else {
      showToast({ title: 'Invalid email', type: 'error' });
    }
  };

  const handleRemoveSharedEmail = (email: string) => {
    setSharedWith(sharedWith.filter(e => e !== email));
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter(c => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  const toggleEffect = (effect: string) => {
    if (effects.includes(effect)) {
      setEffects(effects.filter(e => e !== effect));
    } else {
      setEffects([...effects, effect]);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation({ ...location, address: e.target.value });
  };

  const handleDateChange = (type: 'from' | 'to', value: string) => {
    setDateRange({ ...dateRange, [type]: value });
  };

  const validateForm = () => {
    if (!title) {
      showToast({ title: 'Title is required', type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Create the album object based on form data
    const album = {
      title,
      description,
      coverImage: coverImage ? await convertFileToBase64(coverImage) : null,
      isPrivate,
      sharedWith: isPrivate ? sharedWith : [],
      categories,
      dateRange: dateRange.from || dateRange.to ? {
        from: dateRange.from || null,
        to: dateRange.to || null
      } : null,
      location: location.address ? {
        lat: location.lat,
        lng: location.lng,
        address: location.address
      } : null,
      tags,
      theme: theme.color ? {
        color: theme.color,
        font: theme.font || null,
        layout: theme.layout || null
      } : null,
      effects: effects.length > 0 ? effects : null
    };

    try {
      const result = await createAlbum(album);

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create album in Sanity');
      }

      // Show success message
      showToast({
        title: 'Album created successfully!',
        type: 'success',
      });

      // Close the modal - using onCancel as a fallback
      onClose();
      if (onCancel) onCancel();
    } catch (error) {
      console.error('Error creating album:', error);
      showToast({
        title: 'Failed to create album',
        description: (error as Error).message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert File to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto p-2 relative">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Create New Album</h2>

        {/* Basic Information Section */}
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Basic Information</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter album title"
                className="w-full px-3 py-2 bg-white/10 rounded-md"
                maxLength={100}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter album description"
                className="w-full px-3 py-2 bg-white/10 rounded-md"
                rows={3}
                maxLength={500}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cover Image</label>
              <input
                type="file"
                onChange={handleCoverImageChange}
                accept="image/*"
                className="w-full px-3 py-2 bg-white/10 rounded-md"
              />
              {coverImage && (
                <div className="mt-2">
                  <img 
                    src={URL.createObjectURL(coverImage)} 
                    alt="Cover Preview" 
                    className="h-24 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="isPrivate" className="text-sm">Make this album private</label>
            </div>

            {isPrivate && (
              <div>
                <label className="block text-sm font-medium mb-1">Shared With (Emails)</label>
                <div className="flex">
                  <input
                    type="email"
                    value={sharedWithInput}
                    onChange={(e) => setSharedWithInput(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-3 py-2 bg-white/10 rounded-l-md"
                  />
                  <button
                    type="button"
                    onClick={handleAddSharedEmail}
                    className="px-3 py-2 bg-pink-600 rounded-r-md"
                  >
                    Add
                  </button>
                </div>
                {sharedWith.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sharedWith.map(email => (
                      <div key={email} className="bg-white/10 px-2 py-1 rounded-full flex items-center text-sm">
                        {email}
                        <button
                          type="button"
                          onClick={() => handleRemoveSharedEmail(email)}
                          className="ml-1 text-pink-500 hover:text-pink-400"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Categories & Tags Section */}
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Categories & Tags</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Categories</label>
              <div className="flex flex-wrap gap-2">
                {ALBUM_CATEGORIES.map(category => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => toggleCategory(category.value)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      categories.includes(category.value)
                        ? 'bg-pink-600 text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Enter a tag"
                  className="flex-1 px-3 py-2 bg-white/10 rounded-l-md"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-pink-600 rounded-r-md"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <div key={tag} className="bg-white/10 px-2 py-1 rounded-full flex items-center text-sm">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-pink-500 hover:text-pink-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Date & Location Section */}
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Date & Location</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => handleDateChange('from', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => handleDateChange('to', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={location.address}
                onChange={handleLocationChange}
                placeholder="Enter location"
                className="w-full px-3 py-2 bg-white/10 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Theme & Visual Effects Section */}
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Theme & Visual Effects</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme Color</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {THEME_COLORS.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setTheme({ ...theme, color: color.value })}
                    className={`p-2 rounded flex items-center gap-2 ${
                      theme.color === color.value ? 'ring-2 ring-pink-500' : ''
                    }`}
                    style={{ backgroundColor: `${color.value}20` }}
                  >
                    <div 
                      className="w-5 h-5 rounded-full" 
                      style={{ backgroundColor: color.value }}
                    ></div>
                    <span className="text-xs">{color.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Layout Style</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme({ ...theme, layout: 'grid' })}
                  className={`p-2 rounded bg-white/10 ${
                    theme.layout === 'grid' ? 'ring-2 ring-pink-500' : ''
                  }`}
                >
                  <div className="grid grid-cols-3 gap-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="aspect-square bg-pink-400 rounded-sm"></div>
                    ))}
                  </div>
                  <span className="text-xs block mt-1">Grid</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme({ ...theme, layout: 'masonry' })}
                  className={`p-2 rounded bg-white/10 ${
                    theme.layout === 'masonry' ? 'ring-2 ring-pink-500' : ''
                  }`}
                >
                  <div className="flex gap-1">
                    <div className="w-1/2 space-y-1">
                      <div className="aspect-video bg-pink-400 rounded-sm"></div>
                      <div className="aspect-square bg-pink-400 rounded-sm"></div>
                    </div>
                    <div className="w-1/2 space-y-1">
                      <div className="aspect-square bg-pink-400 rounded-sm"></div>
                      <div className="aspect-video bg-pink-400 rounded-sm"></div>
                    </div>
                  </div>
                  <span className="text-xs block mt-1">Masonry</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme({ ...theme, layout: 'carousel' })}
                  className={`p-2 rounded bg-white/10 ${
                    theme.layout === 'carousel' ? 'ring-2 ring-pink-500' : ''
                  }`}
                >
                  <div className="flex gap-1 overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-1/2 shrink-0 aspect-square bg-pink-400 rounded-sm"></div>
                    ))}
                  </div>
                  <span className="text-xs block mt-1">Carousel</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Visual Effects</label>
              <div className="flex flex-wrap gap-2">
                {VISUAL_EFFECTS.map(effect => (
                  <button
                    key={effect.value}
                    type="button"
                    onClick={() => toggleEffect(effect.value)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      effects.includes(effect.value)
                        ? 'bg-pink-600 text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {effect.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel || onClose} // Use onCancel if available, otherwise use onClose
          className="px-4 py-2 bg-white/10 rounded-md hover:bg-white/20"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 bg-pink-600 rounded-md hover:bg-pink-700 flex items-center ${loading ? 'opacity-70' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : 'Create Album'}
        </button>
      </div>
    </form>
  );
};

export default CreateAlbumForm;