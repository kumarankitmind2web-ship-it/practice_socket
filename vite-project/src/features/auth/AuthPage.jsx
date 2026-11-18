import { useState } from "react";
import { useForm } from "react-hook-form";
import {login, register as userRegister} from "../../services/authService";
import { useDispatch } from 'react-redux';
import { setUser, setAccessToken, setRefreshToken, setIsAuthenticated } from "../../redux/slices/authSlice";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const dispatch = useDispatch();
  const navigate =useNavigate();
   const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" },
  })
  const [mode, setMode] = useState("login");

  const onSubmit = async(data) =>
  {

    const auth = await mode==="login" ? login(data) : userRegister(data);
    console.log("register response ",auth);
     auth.then((response) => {
      if(mode === "login")
      {  
        if(response.status)
        {
            dispatch(setUser(response.data));
            dispatch(setAccessToken(response.accessToken));
            dispatch(setRefreshToken(response.refreshToken));
            dispatch(setIsAuthenticated(true));
            localStorage.setItem("access_token", response.accessToken);
            localStorage.setItem("isAuthentication", true);
            toast.success(mode === "login" ? "Login successful!" : "Registration successful!");
        }
        else
        {
          toast.error(response.message || "Something went wrong!");
        }
      }
      else
      {
         if(response.status)
         {
          toast.success("Registration successful!");
          navigate("/auth");
         }
         else
        {
             toast.error(response.message || "Something went wrong!");
        }
      }
    
    }).catch((error) => {
      console.error("Error during authentication:", error);
      let errorMessage=error.response.data.message || error.message || "Something went wrong!";
      toast.error(errorMessage);
    });

  };

  return (
    <main className="auth-page">
    
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="auth-heading">
            <span className="auth-kicker">
              {mode === "login" ? "WELCOME BACK" : "YOUR PEOPLE ARE HERE"}
            </span>
            <h2>{mode === "login" ? "Good to see you." : "Come on in."}</h2>
            <p>
              {mode === "login"
                ? "Sign in and catch up with your people."
                : "Create your account and make room for more good days."}
            </p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Account action">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={mode === "login" ? "selected" : ""}
              onClick={() => setMode("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              className={mode === "register" ? "selected" : ""}
              onClick={() => setMode("register")}
            >
              Create account
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            {mode === "register" && (
              <>
              <label className="auth-field">
                <span>Your name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="What should we call you?"
                  autoComplete="name"
                  
                  {...register("name", { required: "Name is required" })}
                />
                 {errors.name && <p role="alert" className="text-red-600">{errors.name.message}</p>}
              </label>

              <label className="auth-field">
                <span>User name</span>
                <input
                  type="text"
                  name="username"
                  placeholder="What should we call you?"
                  autoComplete="username"
                  {...register("username", { required: "User name is required" })}
                />
                 {errors.username && <p role="alert" className="text-red-600">{errors.username.message}</p>}
              </label>
              </>
            )}
            <label className="auth-field">
              <span>Email address</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                 {...register("email",{ required: "Email is required" })}
              />
               {errors.email && <p role="alert" className="text-red-600">{errors.email.message}</p>}
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                placeholder="At least 6 characters"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                minLength={mode === "register" ? 6 : undefined}
                 {...register("password",{ required: "Password is required" ,minLength: { value: 6, message: "Password must be at least 6 characters" }})}
              />
               {errors.password && <p role="alert" className="text-red-600">{errors.password.message}</p>}
            </label>

            {mode === "register" && (
              <label className="auth-terms">
                <input type="checkbox" name="terms"  {...register("terms",{ required: "You must agree to the terms" })}/>
                <span>
                  I agree to the Terms of Service and Privacy Policy.
                </span>
                {errors.terms && <p role="alert" className="text-red-600">{errors.terms.message}</p>}
              </label>
            )}

            <button className="auth-submit" type="submit">
              {mode === "login" ? "Sign in to Gather" : "Create my account"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="auth-switch">
            {mode === "login" ? "New around here?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() =>
                setMode((current) =>
                  current === "login" ? "register" : "login",
                )
              }
            >
              {mode === "login" ? "Create an account" : "Sign in instead"}
            </button>
          </p>
        </div>

        <p className="auth-demo-note">
          Frontend demo · Forms are not connected to an account service
        </p>
      </section>
    </main>
  );
}

export default AuthPage;
