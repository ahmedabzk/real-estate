import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const userState = useSelector((state) => state.user);
  const navigate = useNavigate();
  const currentUser = userState.currentUser;
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrl: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
  });
  const [uploadError, setUploadError] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  console.log(formData);
  
  const handleUpload = () => {
   
    if (files.length > 0 && files.length < 7) {
      setLoading(true);
      setUploadError(false);
      const promises = [];
      
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImages(files[i]));
      }

      Promise.all(promises).then((url) => {
        setFormData({
          ...formData,
          imageUrl: formData.imageUrl.concat(url)
        });
        setLoading(false);
        setUploadError(false);
      }).catch((err) => {
        setImageUploadError('image upload failed');
        setLoading(false);
      });
    } else {
      setImageUploadError('you can only upload 6 images per listing');
      setLoading(false);
    }

  }

    const storeImages = async (file) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
          },
          (err) => {
          reject(err);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            })
          }
        )
      });
    };
  
  const handleChange = (e) => {
    if (e.target.id === 'rent' || e.target.id === 'sell') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (e.target.id === 'parking' || e.target.id === 'offer' || e.target.id === 'furnished') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      });
    }

    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      });
    }
  }
  
  const handleRemove = (index) => {
    setFormData({
      ...formData,
      imageUrl: formData.imageUrl.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrl.length < 1) return setError("you must upload at least one image");
      if (+formData.regularPrice < +formData.discountedPrice) return setError("discounted price must be lower than the regular price");
      setCreateLoading(true);
      const res = await fetch("http://localhost:3000/api/listing/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id

        })
      });

      const data = await res.json();
     console.log(data);
      if (data.success === false) {
        setError(data.message);
        setCreateLoading(false);
        setCreateSuccess(false);
        return;
      }
      setCreateSuccess(true);
      setCreateLoading(false);
      navigate(`listing/${data._id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="max-w-4xl py-4 mx-auto p-3">
      <h1 className="font-semibold text-center my-7">Create a Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="name"
            id="name"
            className="border rounded-lg p-3"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="description"
            id="description"
            className="border rounded-lg p-3"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="address"
            id="address"
            className="border rounded-lg p-3"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                type="checkbox"
                placeholder="sell"
                id="sell"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sell"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                placeholder="rent"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="4"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="20000"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center gap-2">
                <p>regular price</p>
                <span>(ksh/month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountedPrice}
                />
                <div className="flex flex-col items-center gap-2">
                  <p>discounted price</p>
                  <span>(Ksh/month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover image (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-600 rounded w-full"
              type="file"
              accept="image/*"
              multiple
            />

            <button
              disabled={loading}
              onClick={handleUpload}
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {loading ? "Loading..." : "upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>
          {formData.imageUrl.length > 0 &&
            formData.imageUrl.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="images"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  className="text-red-700 uppercase rounded-lg hover:opacity-95"
                  onClick={() => handleRemove(index)}
                >
                  delete
                </button>
              </div>
            ))}
          <button
            disabled={createLoading || loading}
            className="p-3 bg-slate-800 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {createLoading ? "creating..." : "create listing"}
          </button>
          {createSuccess && (
            <p className="text-green-700">created listing successfully</p>
          )}
          {error && <p className="text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
}
