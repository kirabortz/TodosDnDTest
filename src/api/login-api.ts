import { AxiosResponse } from "axios";
import { instance } from "../common/instance/instance";
import { BasicResponseType } from "../common/types";
import { InitialiseMeType, LoginParamsType } from "./login-api.types";

export const loginAPI = {
  login(data: LoginParamsType) {
    return instance.post<LoginParamsType, AxiosResponse<BasicResponseType<{ userId: number }>>>("auth/login", data);
  },
  initialiseMe() {
    return instance.get<BasicResponseType<InitialiseMeType>>("auth/me");
  },
  logout() {
    return instance.delete<BasicResponseType>("auth/login");
  },
};
