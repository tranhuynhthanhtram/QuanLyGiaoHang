import { useContext, useEffect, useRef, useState } from "react";
import { Button, Container, Form, Image, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { authAxios, endpoints } from "../configs/API";
import InputItem from "../layouts/InputItems";
import Loading from "../layouts/Loading/Loading";

const ProfileUser = () => {
   const [user, dispatch] = useContext(UserContext);
   const avatar = useRef();
   const nav = useNavigate();
   const [firstName, setFirstName] = useState(user.first_name);
   const [lastName, setLastName] = useState(user.last_name);
   const [username, setUserName] = useState(user.username);
   const [email, setEmail] = useState(user.email);
   const [loading, setLoading] = useState(false)


   // console.log(user);

   const changeProfile = async (event) => {
      event.preventDefault();
      const pack = await authAxios().patch(endpoints["user-id"](user.id),
         {
            avatar: avatar.current.files[0],
            first_name: firstName,
            last_name: lastName,
         },
         {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         },
         setLoading(true));
      console.log(pack.data);
      console.log(pack.status);
      
      if (pack.status === 200) {
         alert("Thay đổi thành công! Vui lòng đăng nhập lại");
         setLoading(false)
      }
      
   };
   
   if (user === null)
      return <Loading />

   return (
      <>
         <Container>
            <h2 className="text-center">Thông tin người dùng</h2>
            <Form onSubmit={changeProfile}>
               <Form.Group className="mb-3" >
                  <Form.Label>Họ và tên lót</Form.Label>
                  <Form.Control type="text" placeholder="Họ và tên lót"
                     value={lastName}
                     onChange={(evt) => setLastName(evt.target.value)} />
               </Form.Group>

               <Form.Group className="mb-3" >
                  <Form.Label>Tên</Form.Label>
                  <Form.Control type="text" placeholder="Tên"
                     value={firstName}
                     onChange={(evt) => setFirstName(evt.target.value)} />
               </Form.Group>

               <Form.Group className="mb-3" >
                  <Form.Label>Tên đăng nhập</Form.Label>
                  <Form.Control type="text" placeholder="Tên đăng nhập"
                     value={username}
                     onChange={(evt) => setUserName(evt.target.value)}
                     disabled={true} />
               </Form.Group>

               <Form.Group className="mb-3" >
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="text" placeholder="Họ và tên lót"
                     value={email}
                     onChange={(evt) => setEmail(evt.target.value)}
                     disabled={true} />
               </Form.Group>

               <Image
                  src={user.image}
                  alt="avatar" />
                  <p></p>

               <Form.Group className="mb-3" >
                  <Form.Label>Ảnh đại diện</Form.Label>
                  <Form.Control type="file" name="avatar-upload" ref={avatar} />
               </Form.Group>

               {loading ? <Loading /> : <Button variant="primary" type="submit">Cập nhật</Button>}
            </Form>
            {user.auth_provider === "default" && <NewPasswordChange />}
         </Container>
      </>
   );
};

const NewPasswordChange = () => {
   const [pw, setPw] = useState();
   const [confirmPw, setConfirmPw] = useState();
   const [checkPw, setCheckPw] = useState(false);
   const [user] = useContext(UserContext);
   const [loading, setLoading] = useState(false)

   const changePassword = async (event) => {
      event.preventDefault();

      try {
         const sendPass = await authAxios().post(
            endpoints["user-change-password"](user.id),
            {
               password: pw,
            },
            {
               headers: {
                  "Content-Type": "multipart/form-data",
               },
            },
            setLoading(true)
         );
         if (sendPass.status === 200) {
            console.log("Change successfully!");
         }
         if (sendPass.status === 201) {
            console.log("Change successfully!");
         }
         
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false)
      }
   };

   useEffect(() => {
      if (confirmPw !== pw) {
         setCheckPw(true);
      } else {
         setCheckPw(false);
      }
   }, [confirmPw, pw]);
   return (
      <>
         <Container>
            <hr></hr>
            <h4 className="text-center">Đổi mật khẩu</h4>
            <Form onSubmit={changePassword}>
               <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <Form.Control type="password" placeholder="Nhập mật khẩu mới"
                     value={pw}
                     onChange={(evt) => setPw(evt.target.value)} />
               </Form.Group>

               <Form.Group className="mb-3" controlId="confirmBasicPassword">
                  <Form.Label>Nhập lại mật khẩu</Form.Label>
                  <Form.Control type="password" placeholder="Nhập lại mật khẩu"
                     value={confirmPw}
                     onChange={(evt) => setConfirmPw(evt.target.value)} />
               </Form.Group>

               {checkPw && <div className="text-danger">Mật khẩu không khớp</div>}
               <p></p>
               {loading ? <Loading /> : <Button variant="primary" type="submit" disabled={checkPw}>Cập nhật</Button>}
               
            </Form>
         </Container>
      </>
   );
};

export default ProfileUser;