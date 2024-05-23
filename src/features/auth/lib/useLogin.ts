import { useAppDispatch, useAppSelector } from "../../../store/store";
import { loginSelectors, loginThunks } from "../../../redux/loginSlice";
import { useFormik } from "formik";
import { LoginParamsType } from "../../../api/login-api.types";

export const useLogin = () => {
  const isLoggedIn = useAppSelector((state) => loginSelectors.isLoggedIn(state));
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: Partial<Omit<LoginParamsType, "captcha">> = {};
      if (!values.email) {
        errors.email = "Required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Required";
      } else if (values.password.length < 3) {
        errors.password = "Password shouldn't be less than 3 symbols or empty";
      }

      return errors;
    },
    onSubmit: (values) => {
      dispatch(loginThunks.loginTC(formik.values));
      formik.resetForm();
    },
  });
  return { isLoggedIn, formik };
};
