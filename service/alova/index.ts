import { createAlova } from "alova";
import fetchAdapter from "alova/fetch";
import { createApis, mountApis, withConfigType } from "./createApis";

export const alovaInstance = createAlova({
  baseURL: "/api/v3",
  requestAdapter: fetchAdapter(),
  beforeRequest: (method) => {},
  responded: (res) => {
    return res.json();
  },
});

export const $$userConfigMap = withConfigType({});

const Apis = createApis(alovaInstance, $$userConfigMap);

mountApis(Apis);

export default Apis;
