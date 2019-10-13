/**
 * Created with WebStorm.
 * @author tsien
 * @version 1.0.0
 * @date 2019/9/24 0024 11:44
 */

import axios from "axios";
import { Message } from "element-ui";

// 对所有的请求进行拦截处理
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    Message.error({ message: "请求超时！" });
    return Promise.resolve(error);
  }
);

// 对所有的响应进行拦截处理
axios.interceptors.response.use(
  response => {
    if (
      response.status &&
      response.status === 200 &&
      response.data.status === 500
    ) {
      Message.error({ message: response.data.msg });
      return;
    }

    if (response.data.msg) {
      Message.success({ message: response.data.msg });
    }
    return response;
  },
  error => {
    if (error.response.status === 504 || error.response.status === 404) {
      Message.error({ message: "服务器被吃了⊙﹏⊙∥" });
    } else if (error.response.status === 403) {
      Message.error({ message: "权限不足,请联系管理员!" });
    } else if (error.response.status === 401) {
      Message.error({ message: error.response.data.msg });
    } else if (error.response.data.msg) {
      Message.error({ message: error.response.data.msg });
    } else {
      Message.error({ message: "未知错误!" });
    }
  }
);

let base = "";

// Post请求
export const postRequest = (url, params) => {
  return axios({
    method: "post",
    // ES6新语法 "hello" + str + "world !"  等同于 `hello ${str} world !`
    url: `${base}${url}`,
    data: params,
    transformRequest: [
      function(data) {
        let ret = "";
        for (let item in data) {
          if (data.hasOwnProperty(item)) {
            ret += `${encodeURIComponent(item)}=${encodeURIComponent(
              data[item]
            )}&`;
          }
        }
        return ret;
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

// 文件上传请求
export const uploadFileRequest = (url, params) => {
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

// Put请求
export const putRequest = (url, params) => {
  return axios({
    method: "put",
    url: `${base}${url}`,
    data: params,
    transformRequest: [
      function(data) {
        let ret = "";
        for (let item in data) {
          if (data.hasOwnProperty(item)) {
            ret +=
              encodeURIComponent(item) +
              "=" +
              encodeURIComponent(data[item]) +
              "&";
          }
        }
        return ret;
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

// delete 请求
export const deleteRequest = url => {
  return axios({
    method: "delete",
    url: `${base}${url}`
  });
};

// get 请求
export const getRequest = url => {
  return axios({
    method: "get",
    url: `${base}${url}`
  });
};
