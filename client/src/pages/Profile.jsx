import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
  updateUserFailure,
  updateUserSuccess,
  startUpdateUser,
  signOutAndDeleteFailure,
  signOutAndDeleteSuccess,
  signOutAndDeleteStart,
} from "../store/auth.js";

export default function Profile() {
  const userState = useSelector((state) => state.user);
  const fileRef = useRef();
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [listingsError, setListingsError] = useState('');
  const [listingsloading, setListingsLoading] = useState(false);
  const [listingsData, setListingsData] = useState([]);
  const [deleteListingSuccess, setDeleteListingSuccess] = useState(false);


  console.log(listingsData);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      handleFileChange(file);
    }
  }, [file]);

  function handleFileChange(file) {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      () => {
        setFileUploadError(true);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({
            ...formData,
            avatar: downloadURL,
          });
        });
      }
    );
  }

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmitChange = async (e) => {
    e.preventDefault();
    try {
      dispatch(startUpdateUser());
      const res = await fetch(
        `http://localhost:3000/api/user/update/${userState.currentUser._id}`,
        {
          method: "POST",

          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (e) {
      dispatch(updateUserFailure(e.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutAndDeleteStart());
      const res = await fetch("http://localhost:3000/api/auth/sign-out");
      const data = await res.json();
      console.log(data);
      dispatch(signOutAndDeleteSuccess(data));
    } catch (e) {
      dispatch(signOutAndDeleteFailure(e.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(signOutAndDeleteStart());
      const res = await fetch(
        `http://localhost:3000/api/user/delete/${userState.currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      dispatch(signOutAndDeleteSuccess(data));
    } catch (err) {
      dispatch(signOutAndDeleteFailure(err.message));
    }
  };

  const handleListCreate = () => {
    navigate("/create-listing");
  };


  
  const handleShowListings = async () => {
    try {
      setListingsLoading(true);
      const res = await fetch(
        `http://localhost:3000/api/user/listings/${userState.currentUser._id}`,
        {
          credentials: 'include'
        }
      );
      const data = await res.json();
      if (data.success === false) {
        setListingsError(data.message);
        setListingsLoading(false);
        return;
      }
      
      setListingsData(data);
      setListingsLoading(false);
    } catch (err) {
      setListingsError(err);
      setListingsLoading(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      setListingsError('');
      const res = await fetch(
        `http://localhost:3000/api/listing/delete/${listingId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await res.json();
      if (data.success === false) {
        setListingsError(data.message);
        setDeleteListingSuccess(false);
        return;
      }
      setDeleteListingSuccess(true);
    } catch (err) {
      setListingsError(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 my-7">
      <h1 className="text-center font-semibold p-8">Profile</h1>

      <form onSubmit={handleSubmitChange} className="flex flex-col gap-4">
        <input
          onChange={handleChange}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || userState.currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center "
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error image uploaded</span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className="text-slate-700">{`uploading: ${filePercent}%`}</span>
          ) : filePercent === 100 ? (
            <span className="text-green-700">Image successfully uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          name="username"
          defaultValue={userState.currentUser.username}
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="email"
          defaultValue={userState.currentUser.email}
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleInputChange}
        />
        <button
          disabled={userState.loading}
          className="bg-blue-950 text-white uppercase p-2 rounded-lg hover:opacity-95"
        >
          {userState.loading ? "Loading..." : "update"}
        </button>
        <button
          onClick={handleListCreate}
          className="bg-green-700 text-white uppercase p-2 rounded-lg hover:opacity-95"
        >
          create listing
        </button>
      </form>
      <div className="flex flex-row justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDelete}>
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>

      <p className="text-red-600">{userState.error ? userState.error : ""}</p>
      <p className="text-green-600 text-center">
        {updateSuccess ? "User updated successfully" : ""}
      </p>
      <button
        disabled={listingsloading}
        onClick={handleShowListings}
        className="text-green-700 uppercase p-2 rounded-lg hover:opacity-95 hover:underline w-full"
      >
        {listingsloading ? "Loading..." : "show listings"}
      </button>
      {listingsError && <p className="text-red text-xl">{listingsError}</p>}

      {listingsData && listingsData.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-2xl font-semibold mt-7">
            Your listings
          </h1>
          {listingsData.map((listing) => (
            <div
              key={listing._id}
              className="flex flex-row p-3 border justify-between items-center gap-3"
            >
              <Link
                to={`listing/${listing._id}`}
                className="w-20 h-20 object-contain"
              >
                <img src={listing.imageUrl[0]} />
              </Link>
              <Link
                to={`listing/${listing._id}`}
                className="font-semibold flex-1 hover:underline"
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-700 uppercase"
                >
                  delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteListingSuccess && (
        <p className="text-green-700 text-xl font-medium text-center">
          deleted listing successfully
        </p>
      )}
    </div>
  );
}
