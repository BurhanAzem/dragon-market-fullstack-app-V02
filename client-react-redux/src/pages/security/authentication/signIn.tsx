import React, { FC, ReactElement, useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Link,
  Typography,
  Button,
  Divider,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google,
  Twitter,
  Facebook
} from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { login } from "../../../redux/slices/authSlice"; // <-- Import from your new slice
import { useTemplateThemeModeContext } from "../../../hooks";
import { TemplateThemeModeContextType } from "../../../context";

// If you still want a local loading indicator, keep a local state or remove it entirely
const SignIn: FC = (): ReactElement => {
  // We read from auth slice
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [cardId, setCardId] = useState("");
  const [password, setPassword] = useState("");
  
  // If you need local loading for an async login flow:
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const { isDark } = useTemplateThemeModeContext() as TemplateThemeModeContextType;

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // Example login handler
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      // In a real app, you might call an API or thunk here.
      // We'll just dispatch `login` with some placeholder user data.
      dispatch(login({ id: "123", name: cardId }));
      // user is now set in Redux. isAuthenticated = true
    } catch (error) {
      console.error("Login failed:", error);
      // handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Box mt={30} display="flex" justifyContent="center">
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <Box
          display="block"
          m="auto"
          px={3}
          pt={3}
          width={400}
          border={1}
          borderRadius={4}
          boxShadow={12}
        >
          <Box
            flexGrow={1}
            display="flex"
            py={2}
            px={3}
            sx={{
              justifyContent: "space-between",
              backgroundColor: "inherit"
            }}
          >
            <Typography variant="h6">Login</Typography>
            <Link
              href="/auth/signup"
              sx={{ fontSize: { xs: "9pt", sm: "9pt", md: "10pt" }, textDecoration: "none", mt: 1 }}
            >
              Don't have an account?
            </Link>
          </Box>

          <Box display="block" px={3} mb={3}>
            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              sx={{ fontSize: { xs: "9pt", sm: "9pt", md: "10pt" } }}
            >
              <InputLabel
                htmlFor="outlined-input-email"
                sx={{ fontSize: { xs: "9pt", sm: "10pt", md: "11pt" } }}
              >
                Email address
              </InputLabel>
              <OutlinedInput
                id="outlined-input-email"
                type="text"
                aria-describedby="my-helper-text"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                label="Email address"
              />
              <FormHelperText id="my-helper-text">
                We'll never share your email.
              </FormHelperText>
            </FormControl>

            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              sx={{ fontSize: { xs: "9pt", sm: "9pt", md: "10pt" } }}
            >
              <InputLabel
                htmlFor="outlined-adornment-password"
                sx={{ fontSize: { xs: "9pt", sm: "10pt", md: "11pt" } }}
              >
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            <Box
              display="flex"
              justifyContent="space-around"
              pt={1}
              flexGrow={1}
              sx={{ backgroundColor: "inherit" }}
            >
              <FormControlLabel
                sx={{ "& .MuiFormControlLabel-label": { fontSize: { xs: "9pt", sm: "9pt", md: "10pt" } } }}
                control={<Checkbox size="small" />}
                label={"Keep me signed in"}
              />
              <Link
                href="/auth/forgetpassword"
                sx={{
                  mt: 1,
                  fontSize: { xs: "9pt", sm: "9pt", md: "10pt" },
                  textDecoration: "none"
                }}
              >
                Forget Password?
              </Link>
            </Box>

            <Box display="block" justifyContent="center" py={2}>
              <Button
                onClick={handleLogin}
                fullWidth
                variant="contained"
                color="primary"
                size="small"
                sx={{ fontSize: { xs: "9pt", sm: "9pt", md: "10pt" } }}
              >
                Login
              </Button>
            </Box>

            <Divider sx={{ pb: 1, fontSize: { xs: "9pt", sm: "10pt", md: "8pt" } }}>
              Powered by Burhan Azem
            </Divider>
          </Box>
        </Box>
      )}
    </>
  );
};

export default SignIn;
