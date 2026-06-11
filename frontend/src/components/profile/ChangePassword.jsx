import {
  useState
} from "react";

import toast from "react-hot-toast";

import {
  changePassword
} from "../../services/authService";

const ChangePassword = () => {

  const [formData,
    setFormData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const handleChange =
    (e) => {

      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value,
      });

    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        formData.newPassword !==
        formData.confirmPassword
      ) {

        return toast.error(
          "Passwords do not match"
        );

      }

      try {

        await changePassword({
          currentPassword:
            formData.currentPassword,

          newPassword:
            formData.newPassword,
        });

        toast.success(
          "Password Updated"
        );

        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Failed"
        );

      }
    };

  return (
    <div className="bg-slate-800 p-6 rounded-xl mt-8">

      <h2 className="text-2xl font-bold mb-4">
        Change Password
      </h2>

      <form
        onSubmit={
          handleSubmit
        }
      >

        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={
            formData.currentPassword
          }
          onChange={
            handleChange
          }
          className="w-full p-3 rounded bg-slate-700 mb-4"
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={
            formData.newPassword
          }
          onChange={
            handleChange
          }
          className="w-full p-3 rounded bg-slate-700 mb-4"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={
            formData.confirmPassword
          }
          onChange={
            handleChange
          }
          className="w-full p-3 rounded bg-slate-700 mb-4"
        />

        <button
          className="bg-yellow-500 text-black px-5 py-3 rounded"
        >
          Change Password
        </button>

      </form>

    </div>
  );
};

export default ChangePassword;