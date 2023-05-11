import { Link, Navigate, useNavigate } from "react-router-dom";
import { AiOutlineFacebook, AiOutlineGoogle } from "react-icons/ai";
import API, { authAxios, endpoints } from "../configs/API";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import cookies from "react-cookies";
import FacebookLogin from "react-facebook-login";
import FirebaseInit from "../firebase/firebase-init";
import {
   getAuth,
   signInWithPopup,
   GoogleAuthProvider,
   signOut,
} from "firebase/auth";
import { Button, Container, Form } from "react-bootstrap";
import Loading from "../layouts/Loading/Loading";

const Login = () => {
   const [username, setUsername] = useState();
   const [password, setPassword] = useState();
   const [loading, setLoading] = useState(false)
   const [user, dispatch] = useContext(UserContext);
   const navigate = useNavigate();

   const login = async (event) => {
      event.preventDefault(); 

      try {
         const clientKey = await API.get(endpoints["oauth2_info"]);
         const res = await API.post(endpoints["login"], {
            client_id: clientKey.data.client_id,
            client_secret: clientKey.data.client_secret,
            username: username,
            password: password,
            grant_type: "password",
         },
         {
            headers: {
               "Content-Type": "application/x-www-form-urlencoded",
            },
         },setLoading(true));

         if (res.status === 200) {
            cookies.save("access_token", res.data.access_token);
            const user = await authAxios().get(endpoints["current_user"]);
            cookies.save("current_user", user.data);
            console.log(user.data);
            dispatch({
               type: "login",
               payload: user.data,
            });
            // navigate(-1); // Chuyển hướng về trang trước đó nếu có
         }
      } catch (error) {
         console.info(error, error.stack);
         alert(`❌Thông tin đăng nhập không chính xác❌`);
      } finally {
         setLoading(false)
      }
   };

   if (user !== null)
        return <Navigate to="/posts/?active=true" />

   FirebaseInit();
   const provider = new GoogleAuthProvider();
   const handleGoogleSignedIn = () => {
      const auth = getAuth();
      console.log(auth);
      signOut(auth);
      signInWithPopup(auth, provider).then(async (result) => {
         const googleAccess = await API.post(endpoints["google-access"], {
            auth_token: result._tokenResponse.oauthIdToken,
         });
         console.log(googleAccess.data);
         cookies.save("access_token", googleAccess.data.tokens.access);
         const user = await authAxios().get(endpoints["current_user"]);
         cookies.save("current_user", user.data);
         console.log(user.data);
         dispatch({
            type: "login",
            payload: user.data,
         });
         // closeModal(false);
      });
   };

   const responseFacebook = async (response) => {
      try {
         const facebookAccess = await API.post(endpoints["facebook-access"], {
            auth_token: response.accessToken,
         });
         console.log(facebookAccess.data.tokens.access);
         if (facebookAccess.status === 400) {
            console.log(facebookAccess.data.auth_token);
         }
         cookies.save("access_token", facebookAccess.data.tokens.access);
         const user = await authAxios().get(endpoints["current_user"]);
         cookies.save("current_user", user.data);
         console.log(user.data);
         dispatch({
            type: "login",
            payload: user.data,
         });
        
      } catch (error) {
         alert(error.response.data.auth_token);
      }
   };

   
   return (
      <>
         <Container>
            <p></p>
            <h4 className="text-center">ĐĂNG NHẬP</h4>
            <Form onSubmit={login}>
               <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Tên đăng nhập</Form.Label>
                  <Form.Control type="text" placeholder="Tên đăng nhập"
                     value={username} onChange={evt => setUsername(evt.target.value)} />
               </Form.Group>

               <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control type="password" placeholder="Mật khẩu"
                     value={password} onChange={evt => setPassword(evt.target.value)} />
               </Form.Group>

               {loading ? <Loading /> : <Button variant="primary" type="submit">Đăng nhập</Button>}


               <Link
                  to="/recovery"
                  className="loginPanel-login--resetPassword"
                  style={{ color: "black", marginLeft: "10px" }}
               >
                  Quên mật khẩu
               </Link>
               <hr></hr>
               <p>Đăng nhập bằng:</p>
               <Container style={{ display: "flex", gap: "10px" }}>
                  <Button className="buttonsLogin-loginOtherWay--google" style={{ backgroundColor: "#f5f5f5", marginRight: '10px' }} onClick={handleGoogleSignedIn}>
                     <AiOutlineGoogle color="black" style={{ fontSize: "1.5em" }} />
                  </Button>
                  {/* <Button className="buttonsLogin-loginOtherWay--facebook" style={{ backgroundColor: "#f5f5f5", marginRight: '10px' }}> */}
                  <div className="App">
                     {/* <AiOutlineFacebook color="black" style={{ fontSize: "1.5em" }} /> */}
                     <FacebookLogin
                        appId="947125076307405"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={responseFacebook}
                        textButton=""
                        icon={<AiOutlineFacebook color="black" style={{ fontSize: "2 em" }} />}
                        size="large"
                        style={{ backgroundColor: "#f5f5f5", border: "none", color: "black" }}
                     />
                  </div>

               </Container>
            </Form>
         </Container>
      </>
   );
};

export default Login;

