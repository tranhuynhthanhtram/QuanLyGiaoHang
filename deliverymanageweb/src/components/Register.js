import { useRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import API, { authAxios, endpoints } from "../configs/API";
import { Form, Button, Container } from "react-bootstrap";
import Loading from "../layouts/Loading/Loading";

const Register = () => {
   const [user, setUser] = useState({
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      userType: ""
   });
   const [loading, setLoading] = useState(false)
   const avatar = useRef();
   const before_identificationcard = useRef();
   const after_identificationcard = useRef();
   const nav = useNavigate();
   const change = (obj) => {
      setUser({
         ...user,
         ...obj,
      });
   };
   const register = async (event) => {
      event.preventDefault();
      let data = new FormData();

      data.append("first_name", user.firstName);
      data.append("last_name", user.lastName);
      data.append("username", user.username);
      data.append("password", user.password);
      data.append("email", user.email);
      data.append("user_type", user.userType);
      data.append("avatar", avatar.current.files[0]);
      data.append("before_identificationcard",before_identificationcard.current.files[0]);
      data.append("after_identificationcard", after_identificationcard.current.files[0]);

      try {
         const res = await API.post(endpoints["users"], data, {
            headers: {
               "Content-Type": "multipart/form-data",
            }
         }, setLoading(true));
         if (res.status === 201) {
            alert("Sign on successful");
            nav("/login")
         }
         else
            alert("Hệ thống đang có lỗi! Vui lòng quay lại sau!")
      } catch (error) {
         alert(error.message);
      } finally {
         setLoading(false)
     }
   };

   return (
      <>
         <h5 className="text-center">Đăng ký</h5>
         <Container>
            <Form onSubmit={register}>
               <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Họ và tên lót</Form.Label>
                  <Form.Control type="text" placeholder="Nhập họ và tên lót"
                     value={user.lastName} onChange={evt => change({ lastName: evt.target.value })} />
               </Form.Group>

               <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Tên</Form.Label>
                  <Form.Control type="text" placeholder="Nhập tên"
                     value={user.firstName} onChange={evt => change({ firstName: evt.target.value })} />
               </Form.Group>

               <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Tên đăng nhập</Form.Label>
                  <Form.Control type="text" placeholder="Tên đăng nhập"
                     value={user.username} onChange={evt => change({ username: evt.target.value })} />
               </Form.Group>

               <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Nhập email"
                     value={user.email} onChange={evt => change({ email: evt.target.value })} />
               </Form.Group>


               <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control type="password" placeholder="Nhập mật khẩu"
                     value={user.password} onChange={evt => change({ password: evt.target.value })} />
               </Form.Group>

               <Form.Group className="mb-3" controlId="confirmformBasicPassword">
                  <Form.Label>Xác nhận mật khẩu</Form.Label>
                  <Form.Control type="password" placeholder="Nhập lại mật khẩu"
                     value={user.confirmPassword} onChange={evt => change({ confirmPassword: evt.target.value })} />
               </Form.Group>

               <Form.Group className="mb-3" >
                  <Form.Label>Ảnh đại diện</Form.Label>
                  <Form.Control type="file" name="avatar-upload" ref={avatar} />
               </Form.Group>

               <Form.Group className="mb-3" >
                  <Form.Label>Mặt trước CCCD</Form.Label>
                  <Form.Control type="file" name="avatar-upload" ref={before_identificationcard} />
               </Form.Group>

               <Form.Group className="mb-3" >
                  <Form.Label>Mặt sau CCCD</Form.Label>
                  <Form.Control type="file" name="avatar-upload" ref={after_identificationcard} />
               </Form.Group>

               <Form.Group className="mb-3" >
                  <Form.Label>Chọn người dùng</Form.Label>
                  <Form.Select aria-label="Default select example" onChange={evt => change({ userType: evt.target.value })}>
                     <option >Người dùng</option>
                     <option value="customer">Khách hàng</option>
                     <option value="shipper">Shipper</option>
                  </Form.Select>
               </Form.Group>

               {loading ? <Loading /> : <Button variant="primary" type="submit">Đăng ký</Button>}

               <Link to="/login" className="inputPanel-signOn--resetPassword"
                  style={{ color: "black", marginLeft: "10px" }}>
                  Tôi đã có tài khoản
               </Link>
            </Form>
         </Container>
         {/* <div className="background-blur-modal"></div>
         <div className="signOn--modal">
            <div className="signOn-Modal--close">
               <button
                  className="signOn-Modal--closeButton"
                  onClick={() => {
                     closeModal(false);
                  }}
               >
                  <AiFillCloseCircle />
               </button>
            </div>
            <div className="signOn-Modal--title">Sign in</div>
            <div className="signOn-Modal--container">
               <div className="signOn-Modal--main">
                  <Form onSubmit={signOn} className="signOn-modal--inputPanel">
                     <Form.Group className="inputPanel-signOn--usernameField">
                        <Form.Label className="usernameField-inputPanel--username">
                           Username
                        </Form.Label>
                        <Form.Control
                           type="text"
                           className="usernameField-inputPanel--inputUsername"
                           value={newUser.username}
                           onChange={(evt) =>
                              change({ username: evt.target.value })
                           }
                        ></Form.Control>
                     </Form.Group>
                     <Form.Group className="inputPanel-signOn--usernameField">
                        <Form.Label className="usernameField-inputPanel--username">
                           Password
                        </Form.Label>
                        <Form.Control
                           type="password"
                           className="usernameField-inputPanel--inputUsername"
                           value={newUser.password}
                           onChange={(evt) =>
                              change({ password: evt.target.value })
                           }
                        ></Form.Control>
                     </Form.Group> */}
                     {/* <Form.Group className="inputPanel-signOn--usernameField">
                        <Form.Label className="usernameField-inputPanel--username">
                           Confirm Password
                        </Form.Label>
                        <Form.Control
                           type="password"
                           className="usernameField-inputPanel--inputUsername"
                           value={confirmPass}
                           onChange={checkConfirmPass}
                        ></Form.Control>
                     </Form.Group> */}
                     {/* <Form.Group className="inputPanel-signOn--usernameField">
                        <Form.Label className="usernameField-inputPanel--username">
                           Email address
                        </Form.Label>
                        <Form.Control
                           type="email"
                           className="usernameField-inputPanel--inputUsername"
                           value={newUser.email}
                           onChange={(evt) =>
                              change({ email: evt.target.value })
                           }
                        ></Form.Control>
                     </Form.Group>
                     <Form.Group className="inputPanel-signOn--usernameField">
                        <Form.Label className="usernameField-inputPanel--username">
                           Avatar
                        </Form.Label>
                        <Form.Control
                           type="file"
                           name="avatar-upload"
                           ref={avatar}
                        ></Form.Control>
                     </Form.Group>
                     <Form.Group className="inputPanel-signOn--buttonLogin">
                        <button
                           type="submit"
                           className="buttonSignOn-inputPanel-submit"
                        >
                           Sign On
                        </button>
                     </Form.Group>
                     <Link to="/" className="inputPanel-signOn--resetPassword">
                        I already have an account
                     </Link>
                  </Form>
               </div>
            </div>
         </div> */}
      </>
   );
};

export default Register;