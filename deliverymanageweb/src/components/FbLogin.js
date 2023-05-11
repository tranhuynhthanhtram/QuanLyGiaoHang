import React from "react";
import ReactFacebookLogin from "react-facebook-login";

function FbLogin() {
   const responseFacebook = (response) => {
      console.log(response);
      console.log(response.accessToken);
   };
   return (
      <div className="App">
         <ReactFacebookLogin
            appId="1351993755298694"
            autoLoad={true}
            fields="name,email,picture"
            callback={responseFacebook}
         />
      </div>
   );
}

export default FbLogin;