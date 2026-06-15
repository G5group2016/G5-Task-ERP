import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../../services/authService";
import { Eye, EyeOff } from "lucide-react";
// import logo from "../../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(formData);

      localStorage.setItem(
        "token",
        data.accessToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      toast.success("Login Successful");

      const role = data.user.role;

      switch (role) {
        case "SUPER_ADMIN":
          navigate("/dashboard");
          break;

        case "OFFICE_MANAGER":
          navigate("/dashboard");
          break;

        case "COMPANY_ADMIN":
          navigate("/company-dashboard");
          break;

        case "TEAM_LEAD":
          navigate("/team-dashboard");
          break;

        case "EMPLOYEE":
          navigate("/employee-dashboard");
          break;

        default:
          navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-lg"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img
            src="./images/group-logo.png"
            alt="G5 Group Logo"
            className="w-58 h-48 mx-auto mb-3 object-contain"
          />
          {/* <h1 className="text-3xl font-bold text-white">G5 Group</h1> */}
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded bg-slate-800 outline-none text-white placeholder-slate-400"
          required
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 outline-none text-white placeholder-slate-400 pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging In..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;