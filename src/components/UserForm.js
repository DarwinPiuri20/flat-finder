import { useState, useRef, useEffect } from "react";
import { Box, Button, TextField, Grid, Snackbar, Alert, Card, CardMedia, Typography } from "@mui/material";
import { Api } from "../services/api"; // Importa tu clase Api

export default function UserForm({ type, userId }) {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    birthDate: '',
    role: "",
  });
  const [email, setEmail] = useState("");
  const [userLoaded, setUserLoaded] = useState(false);
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const birthDateRef = useRef("");
  const userTypeRef = useRef('');
  const [roleRef, setRole] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [password, setPassword] = useState("");
  let pathImg; // Declare pathImg variable here

  const api = new Api();

  if (!userId && type !== 'create') {
    userId = JSON.parse(localStorage.getItem('user_logged'));
  }
  
  const today = new Date();
  const minBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split("T")[0];
  const maxBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()).toISOString().split("T")[0];
  let nameButton = "Create";

  if (type === "update") {
    nameButton = "Update";
  }
 

 const getUserData = async () => {
   try {
     const response = await api.get('users/user/' + userId);
     setUser(response.data.data);
     setRole(response.data.data.role);
     setUserLoaded(true);
   }catch (error) {
     setAlertMessage("Error retrieving user data");
     setIsAlertOpen(true);
   }
 }

  const getCurrentUserData = async () => {
    try {
      const response = await api.get('users/user-logged'); // Ajusta la ruta según tu API
      setUser(response.data.data);
      console.log(response.data.data);
      setRole(response.data.data.role);
      setUserLoaded(true);
    } catch (error) {
      setAlertMessage("Error retrieving current user data");
      setIsAlertOpen(true);
    }
  };

  const processData = async () => {
     if (type === 'view'|| type === 'update') {
      await getCurrentUserData();
    }if(type==='view-profile'){
      await getUserData();
    } 
    else {
      setUserLoaded(true);
    }
  };

  useEffect(() => {
    processData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      firstNameRef.current.value.trim() === "" ||
      lastNameRef.current.value.trim() === "" ||
      emailRef.current.value.trim() === "" ||
      birthDateRef.current.value.trim() === ""
    ) {
      setAlertMessage("Please fill out all fields");
      setIsAlertOpen(true);
      return;
    }

    const userToSend = {
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      email: emailRef.current.value,
      birthDate: birthDateRef.current.value,
      role: userTypeRef.current.value,
    };

  

    try {
      if (type === "create") {
        userToSend.password = passwordRef.current.value;
        await api.post('auth/register', userToSend);
        setAlertMessage("User created");
        resetFields();
      } if (type === "update") {
        await api.patch(`users/user/0`, userToSend);
        setAlertMessage("User updated");
      } if (type === "view") {
        await api.get(`users/`);
        setAlertMessage("User viewed");
      }if (type === "view-profile") {
        await api.get(`users/user/{userId}`);
        setAlertMessage("User viewed");
      }
      setIsAlertOpen(true);
    } catch (error) {
      setAlertMessage("Error saving user data");
      setIsAlertOpen(true);
    }
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setAlertMessage("Invalid email format");
      setIsAlertOpen(true);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsAlertOpen(false);
  };

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    if (passwordValue.length < 6) {
      setAlertMessage("Password must be at least 6 characters long");
      setIsAlertOpen(true);
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{6,}$/;
    if (!passwordRegex.test(passwordValue)) {
      setAlertMessage("Password must contain at least one letter, one number, and one special character");
      setIsAlertOpen(true);
    }
  };

  const fileHandler = async (e) => {
    const file = e.target.files[0];
    pathImg = URL.createObjectURL(file);
  };

  const resetFields = () => {
    firstNameRef.current.value = "";
    lastNameRef.current.value = "";
    emailRef.current.value = "";
    birthDateRef.current.value = "";
    setRole("");
    if (passwordRef.current) {
      passwordRef.current.value = "";
    }
  };

  return (
    <>
      <Box
        bgcolor={'rgba(255, 255, 255, 0.5)'}
        component="form"
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-4 border rounded"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {userLoaded ? (
          <>
            {type !== "create" && (
              <Card
                sx={{ maxWidth: 200 }}
                style={{ padding: "10px", marginBottom: "30px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="100"
                    image={user.imgPerson}
                    alt="Person"
                    style={{
                      borderRadius: "5px",
                      maxHeight: 100,
                      maxWidth: "100%",
                      objectFit: "cover",
                      display: "block",
                      margin: "auto",
                    }}
                  />
                </div>
              </Card>
            )}

            <Grid container spacing={2} sx={{ maxWidth: "100%", overflow: "auto" }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled={type === "view" }
                  label="First Name"
                  inputRef={firstNameRef}
                  defaultValue={user.firstName}
                  variant="outlined"
                  className="w-full"
                  sx={{ marginBottom: "2px" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled={type === "view"}
                  label="Last Name"
                  inputRef={lastNameRef}
                  defaultValue={user.lastName}
                  variant="outlined"
                  className="w-full"
                  sx={{ marginBottom: "2px" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled={type === "view"}
                  type="email"
                  label="Email"
                  inputRef={emailRef}
                  defaultValue={user.email}
                  variant="outlined"
                  className="w-full"
                  sx={{ marginBottom: "2px" }}
                  onChange={handleEmailChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {type === "create" && (
                  <TextField
                    type={"password"}
                    label="Password"
                    inputRef={passwordRef}
                    variant="outlined"
                    className="w-full"
                    sx={{ marginBottom: "2px" }}
                    onChange={handlePasswordChange}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled={type === "view" || type === "update"}
                  label="Birth Date"
                  type="date"
                  inputRef={birthDateRef}
                  inputProps={{ min: maxBirthDate, max: minBirthDate }}
                  defaultValue={user.birthDate ? user.birthDate.slice(0, 10) : ""}
                  variant="outlined"
                  className="w-full"
                  sx={{ marginBottom: "8px" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ minWidth: 150 }}>
                  {(type === "create" ) ? (
                    <TextField
                      select
                      label="User Type"
                      variant="outlined"
                      SelectProps={{ native: true }}
                      className="w-full mb-5"
                      inputRef={userTypeRef}
                    >
                       <option key="owner" value="owner">Owner</option>
                       <option key="renter" value="renter">Renter</option>
                    </TextField>
                  ) : (
                    <TextField
                      defaultValue={user.role}
                      label="User Type"
                      variant="outlined"
                      className="w-full mb-5"
                      disabled
                    />
                  )}
                </Box>
              </Grid>

              {type === "update" && (
                <Grid item xs={2} sm={2}>
                  <div className="form-group">
                    <input
                      type="file"
                      id="file"
                      placeholder="Add image"
                      className="form-control"
                      onChange={fileHandler}
                    />
                  </div>
                </Grid>
              )}

              {type !== "view" && (
                <Button type="submit" variant="contained" sx={{ backgroundColor: 'black', marginTop: '60px', marginX: 'auto' }}>
                  {nameButton}
                </Button>
              )}
            </Grid>

            <Snackbar
              open={isAlertOpen}
              autoHideDuration={6000}
              onClose={handleAlertClose}
            >
              <Alert onClose={handleAlertClose} severity="error">
                {alertMessage}
              </Alert>
            </Snackbar>
          </>
        ) : (
          <Typography variant="h6" color="primary" align="center" mt={4}>
            Loading...
          </Typography>
        )}
      </Box>
    </>
  );
}
