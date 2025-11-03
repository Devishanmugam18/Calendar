"use client";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import AppTitle from "@/components/AppTitle";
import GoogleLogo from "../../assets/Google-G-logo.svg";
import Image from "next/image";

export default function Login() {
  const [userCredential, setUserCredential] = useState({
    email: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState();
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setUserCredential((prev) => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCredential({
      ...userCredential,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!userCredential.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(userCredential.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!userCredential.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    setLoginError("");
    if (Object.keys(newErrors).length === 0) {
      try {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", userCredential.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // checking firebase
        const userData = await signInWithEmailAndPassword(
          auth,
          userCredential.email,
          userCredential.password
        );
        router.push("/calendar");
      } catch (err) {
        setLoginError("Invalid credentials");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      console.log("signwithpop return rsult", result);

      router.push("/calendar");
    } catch (error) {
      console.log("Error Google Login:", error.message);
    }
  };
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true });
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <AppTitle />
      <Paper
        elevation={isSmall ? 0 : 2}
        sx={{
          m: "24px auto",
          mt: { xs: 0, sm: 4, md: 4, lg: 3 },
          maxWidth: "23rem",
          p: 3,
          borderRadius: "10px",
        }}
      >
        <form onSubmit={handleLogin}>
          <TextField
            id="email"
            placeholder="Enter your email"
            variant="outlined"
            fullWidth
            name="email"
            value={userCredential.email}
            onChange={handleChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              },
            }}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />

          <TextField
            type={isVisible ? "text" : "password"}
            id="password"
            placeholder="Enter your password"
            variant="outlined"
            name="password"
            value={userCredential.password}
            fullWidth
            onChange={handleChange}
            sx={{ mt: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </InputAdornment>
                ),
              },
            }}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "text.secondary",
            }}
          >
            <FormControlLabel
              control={<Checkbox checked={rememberMe} />}
              label="Remember Me"
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <Typography
              variant="body2"
              onClick={() => router.push("/forgotPassword")}
              sx={{
                color: "primary.main",
                cursor: "pointer",
                // textDecoration: "underline",
                "&:hover": { color: "primary.dark" },
                fontSize: "1rem",
              }}
            >
              Forgot Password?
            </Typography>
          </Box>

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 2, mb: 1 }}
          >
            Login
          </Button>
          {loginError && (
            <Typography
              color="error"
              sx={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              {loginError}
            </Typography>
          )}
          <Typography
            sx={{
              display: "flex",
              justifyContent: "space-around",
              color: "gray",
              mt: 0.3,
            }}
          >
            Or
          </Typography>
        </form>

        <Button
          onClick={handleGoogleLogin}
          variant="outlined"
          fullWidth
          startIcon={
            <Image src={GoogleLogo} alt="Google logo" width="20" height="20" />
          }
          sx={{ mt: 1 }}
        >
          Login with Google
        </Button>
        <Typography
          variant="body2"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "gray",
            mt: 1,
          }}
        >
          Don't have an account?
          <Button onClick={() => router.push("/register")}>Sign Up</Button>
        </Typography>
      </Paper>
    </Box>
  );
}
