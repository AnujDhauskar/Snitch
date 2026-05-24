import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import snitchDenimHero from "../../../assets/snitch_denim_hero.png";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { handleRegister, loading, error } = useAuth();
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    password: "",
    isSeller: false,
    agreeTerms: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    const fullname = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
    if (fullname.length < 3) {
      errors.fullname = "Full name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.contact.trim()) {
      errors.contact = "Contact number is required";
    } else if (formData.contact.trim().length < 10) {
      errors.contact = "Contact must be at least 10 digits";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = "You must agree to the terms & conditions";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear errors as user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fullname = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
    const result = await handleRegister({
      email: formData.email,
      contact: formData.contact,
      password: formData.password,
      fullname,
      isSeller: formData.isSeller,
    });

    if (result && result.success) {
      setIsSuccess(true);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#E5E1E4] flex items-center justify-center p-4 font-sans select-none antialiased selection:bg-[#8B5CF6]/30 selection:text-white">
      {/* Glow Effect behind the main card */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/5 blur-[120px] pointer-events-none"></div>

      {/* Main card */}
      <div className="w-full max-w-[1000px] bg-[#121214] border border-white/10 rounded-[24px] overflow-hidden flex flex-col md:flex-row relative z-10 shadow-2xl shadow-purple-950/10">
        
        {/* Left Side: Illustration */}
        <div className="w-full md:w-[48%] relative hidden md:block select-none min-h-[550px] md:min-h-full p-3">
          <div className="relative w-full h-full rounded-[18px] overflow-hidden group">
            <img 
              src={snitchDenimHero} 
              alt="Registration Banner" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
            />
            {/* Dark gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/50 to-transparent z-10"></div>
            
            {/* Content overlay on the image */}
            <div className="absolute bottom-8 left-5 right-5 text-left z-20">
              <p className="text-xs tracking-widest uppercase text-white/40 mb-1 font-semibold">Snitch</p>
              <p className="text-sm text-white/70 font-medium tracking-wide">Elevate Your Style.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-[52%] p-8 sm:p-12 flex flex-col justify-center">
          {isSuccess ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2 font-display">Account Created!</h2>
              <p className="text-[#958EA0] text-sm max-w-sm mx-auto mb-8">
                Welcome to Snitch. Your registration was successful and you are now logged in.
              </p>
              <button 
                onClick={() => navigate("/")} 
                className="px-6 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-95 transition-all text-white font-medium rounded-full text-sm shadow-lg shadow-purple-900/30"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-[32px] font-bold text-white tracking-tight mb-2 font-display">Create an account</h2>
                <p className="text-sm text-[#958EA0]">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#DDD6FE] hover:text-[#C8C2E9] font-medium transition-colors hover:underline">
                    Log in
                  </Link>
                </p>
              </div>

              {/* Server-side Error Banner */}
              {error && (
                <div className="mb-6 p-4 bg-[#FFB4AB]/10 border border-[#FFB4AB]/20 text-[#FFB4AB] rounded-xl text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Names Row */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* First Name */}
                  <div className="flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#958EA0] mb-1.5 ml-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Bardia"
                      className={`w-full bg-[#121214] border ${formErrors.firstName ? "border-[#FFB4AB]" : "border-white/10"} focus:border-[#8B5CF6] outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-[#494454] transition-all`}
                    />
                    {formErrors.firstName && (
                      <span className="text-xs text-[#FFB4AB] mt-1 block ml-1">{formErrors.firstName}</span>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#958EA0] mb-1.5 ml-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className={`w-full bg-[#121214] border ${formErrors.lastName ? "border-[#FFB4AB]" : "border-white/10"} focus:border-[#8B5CF6] outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-[#494454] transition-all`}
                    />
                    {formErrors.lastName && (
                      <span className="text-xs text-[#FFB4AB] mt-1 block ml-1">{formErrors.lastName}</span>
                    )}
                  </div>
                </div>

                {formErrors.fullname && (
                  <span className="text-xs text-[#FFB4AB] mt-0.5 block ml-1">{formErrors.fullname}</span>
                )}

                {/* Contact & Email Row */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Email */}
                  <div className="flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#958EA0] mb-1.5 ml-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={`w-full bg-[#121214] border ${formErrors.email ? "border-[#FFB4AB]" : "border-white/10"} focus:border-[#8B5CF6] outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-[#494454] transition-all`}
                    />
                    {formErrors.email && (
                      <span className="text-xs text-[#FFB4AB] mt-1 block ml-1">{formErrors.email}</span>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#958EA0] mb-1.5 ml-1">
                      Contact
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full bg-[#121214] border ${formErrors.contact ? "border-[#FFB4AB]" : "border-white/10"} focus:border-[#8B5CF6] outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-[#494454] transition-all`}
                    />
                    {formErrors.contact && (
                      <span className="text-xs text-[#FFB4AB] mt-1 block ml-1">{formErrors.contact}</span>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#958EA0] mb-1.5 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
                      className={`w-full bg-[#121214] border ${formErrors.password ? "border-[#FFB4AB]" : "border-white/10"} focus:border-[#8B5CF6] outline-none rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-[#494454] transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#958EA0] hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <span className="text-xs text-[#FFB4AB] mt-1 block ml-1">{formErrors.password}</span>
                  )}
                </div>

                {/* Seller & Terms Checkboxes */}
                <div className="space-y-3 pt-2">
                  {/* Seller Flag */}
                  <label className="flex items-center gap-3 cursor-pointer group text-sm select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isSeller"
                        checked={formData.isSeller}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border border-white/20 rounded-md bg-[#121214] peer-checked:bg-[#8B5CF6] peer-checked:border-[#8B5CF6] transition-all flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-[#958EA0] group-hover:text-[#E5E1E4] transition-colors">
                      Register as a <span className="text-[#DDD6FE] font-medium">Seller</span>
                    </span>
                  </label>

                  {/* Terms Checkbox */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer group text-sm select-none">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className={`w-5 h-5 border ${formErrors.agreeTerms ? "border-[#FFB4AB]" : "border-white/20"} rounded-md bg-[#121214] peer-checked:bg-[#8B5CF6] peer-checked:border-[#8B5CF6] transition-all flex items-center justify-center`}>
                          <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-[#958EA0] group-hover:text-[#E5E1E4] transition-colors">
                        I agree to the <a href="#terms" className="text-[#DDD6FE] hover:text-[#C8C2E9] underline font-medium">terms & conditions</a>
                      </span>
                    </label>
                    {formErrors.agreeTerms && (
                      <span className="text-xs text-[#FFB4AB] mt-1 block ml-1">{formErrors.agreeTerms}</span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-[24px] shadow-lg shadow-purple-950/20 active:scale-[0.98] transition-all text-sm mt-4 relative overflow-hidden"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </div>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>

              {/* Or Register With Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="border-t border-white/5 w-full"></div>
                <span className="absolute bg-[#121214] px-4 text-xs uppercase tracking-wider text-[#494454] font-medium">
                  Or register with
                </span>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => window.location.href = "/api/auth/google"}
                  type="button"
                  className="border border-[#DDD6FE]/10 hover:border-[#DDD6FE]/30 hover:bg-[#DDD6FE]/5 text-[#E5E1E4] py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2.5"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24"> 
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.25-3.125C18.29 1.21 15.52.5 12.24.5c-6.35 0-11.5 5.15-11.5 11.5s5.15 11.5 11.5 11.5c6.63 0 11.04-4.66 11.04-11.2 0-.75-.08-1.325-.2-1.815H12.24z"
                    />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="border border-[#DDD6FE]/10 hover:border-[#DDD6FE]/30 hover:bg-[#DDD6FE]/5 text-[#E5E1E4] py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2.5"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.68-1.12 1.82-.98 2.92.1.08.2.12.3.12.87 0 1.96-.53 2.51-1.43z" />
                  </svg>
                  Apple
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
