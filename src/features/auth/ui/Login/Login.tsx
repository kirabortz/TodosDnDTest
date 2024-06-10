import React from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Navigate } from "react-router-dom";
import { useLogin } from "../../lib/useLogin";

export const Login = () => {
  const { isLoggedIn, formik } = useLogin();
  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }


  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <FormControl>
          <FormLabel>
            <p>
              To log in get registered
              <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>Email: test.incubator.test@mail.ru</p>
            <p>Password: test123</p>
          </FormLabel>
          <form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <TextField label="Email" margin="normal" {...formik.getFieldProps("email")} />
              {formik.touched.email && formik.errors.email && <div style={{ color: "red" }}>{formik.errors.email}</div>}
              <TextField type="password" label="Password" margin="normal" {...formik.getFieldProps("password")} />
              {formik.touched.password && formik.errors.password && <div style={{ color: "red" }}>{formik.errors.password}</div>}
              <FormControlLabel label={"Remember me"} control={<Checkbox {...formik.getFieldProps("rememberMe")} />} />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </form>
        </FormControl>
      </Grid>
    </Grid>
  );
};
