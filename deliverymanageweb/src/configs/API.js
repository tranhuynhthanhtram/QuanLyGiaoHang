import axios from "axios";
import cookies from "react-cookies";

export let endpoints = {
   users: "/users/",
   "user-id": (userId) => `/users/${userId}/`,
   current_user: "/users/current_user/",
   "oauth2_info": "/oauth2_info/",
   "login": "/o/token/",
   recoveryPass: "/users/reset_password/",
   confirmPass: "/users/reset_password/confirm/",
   "facebook-access": "/social_auth/facebook/",
   "google-access": "/social_auth/google/",
   "user-change-password": (userId) => `/users/${userId}/change_password/`,
   posts: "/posts/",
   "post-id": (postId) => `/posts/${postId}/`,
   "upload-image": "/upload_image/",
   "post-auctions": (postId) => `/posts/${postId}/auction/`,
   "post-shipper": (postId) => `/posts/${postId}/shipper/`,
   "order": "/order/",
   "order-id": (postId) => `/order/${postId}/`,
   "order-status": (postId) =>  `/order/${postId}/`
};

export const authAxios = () =>
   axios.create({
      baseURL: "http://localhost:8000",
      headers: {
         Authorization: `Bearer ${cookies.load("access_token")}`,
      },
   });

export default axios.create({
   baseURL: "http://localhost:8000",
});