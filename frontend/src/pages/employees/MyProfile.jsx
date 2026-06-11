import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../../services/authService";
import ChangePassword
from "../../components/profile/ChangePassword";

const MyProfile = () => {

  const [user,
    setUser] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  const [image,
    setImage] =
    useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile =
    async () => {

      try {

        const data =
          await getProfile();

        setUser(data);

      } catch (error) {

        toast.error(
          "Failed to load profile"
        );

      } finally {

        setLoading(false);

      }
    };

  const handleChange =
    (e) => {

      setUser({
        ...user,
        [e.target.name]:
          e.target.value,
      });

    };

  const handleUpdate =
    async (e) => {

      e.preventDefault();

      try {

        await updateProfile({
          fullName:
            user.fullName,
          phone:
            user.phone,
          designation:
            user.designation,
          department:
            user.department,
        });

        toast.success(
          "Profile Updated"
        );

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Update Failed"
        );

      }
    };

  const handleImageUpload =
    async () => {

      if (!image) {

        return toast.error(
          "Select an image"
        );

      }

      try {

        await uploadProfileImage(
          image
        );

        toast.success(
          "Image Uploaded"
        );

        loadProfile();

      } catch (error) {

        toast.error(
          "Upload Failed"
        );

      }
    };

  if (loading) {

    return (
      <div>
        Loading...
      </div>
    );

  }

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-4xl font-bold mb-6">
        My Profile
      </h1>

      <div className="bg-slate-800 p-6 rounded-xl">

        <div className="flex flex-col md:flex-row gap-8">

          <div>

            <img
              src={
                user?.profileImage ||
                "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-yellow-500"
            />

            <input
              type="file"
              className="mt-4"
              onChange={(e) =>
                setImage(
                  e.target.files[0]
                )
              }
            />

            <button
              onClick={
                handleImageUpload
              }
              className="bg-yellow-500 text-black px-4 py-2 rounded mt-3 w-full"
            >
              Upload Image
            </button>

          </div>

          <form
            onSubmit={
              handleUpdate
            }
            className="flex-1"
          >

            <input
              type="text"
              name="fullName"
              value={
                user?.fullName ||
                ""
              }
              onChange={
                handleChange
              }
              className="w-full p-3 rounded bg-slate-700 mb-4"
            />

            <input
              type="email"
              value={
                user?.email ||
                ""
              }
              disabled
              className="w-full p-3 rounded bg-slate-700 mb-4"
            />

            <input
              type="text"
              name="phone"
              value={
                user?.phone ||
                ""
              }
              onChange={
                handleChange
              }
              className="w-full p-3 rounded bg-slate-700 mb-4"
              placeholder="Phone"
            />

            <input
              type="text"
              name="designation"
              value={
                user?.designation ||
                ""
              }
              onChange={
                handleChange
              }
              className="w-full p-3 rounded bg-slate-700 mb-4"
              placeholder="Designation"
            />

            <input
              type="text"
              name="department"
              value={
                user?.department ||
                ""
              }
              onChange={
                handleChange
              }
              className="w-full p-3 rounded bg-slate-700 mb-4"
              placeholder="Department"
            />

            <input
              type="text"
              value={
                user?.role ||
                ""
              }
              disabled
              className="w-full p-3 rounded bg-slate-700 mb-4"
            />

            <input
              type="text"
              value={
                user?.company
                  ?.name || ""
              }
              disabled
              className="w-full p-3 rounded bg-slate-700 mb-4"
            />

            <button
              type="submit"
              className="bg-green-600 px-5 py-3 rounded"
            >
              Update Profile
            </button>

          </form>

        </div>
          <ChangePassword />

      </div>

    </div>
  );
};

export default MyProfile;