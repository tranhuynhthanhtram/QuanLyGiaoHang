import cookie from "react-cookies"

const myReducer = (user, action) => {
   switch (action.type) {
      case "login":
         return action.payload;
      case "logout":
         cookie.remove('access_token')
         cookie.remove('current_user')
         return null;
   }
   return user;
};
 
 export default myReducer;