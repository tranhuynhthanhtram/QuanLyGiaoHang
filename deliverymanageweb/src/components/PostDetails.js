import { Navigate, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../App";
import { useContext, useEffect, useRef, useState } from "react";
import { authAxios, endpoints } from "../configs/API";
import Loading from "../layouts/Loading/Loading";
import { Button, Card, Col, Container, Form, Image, Modal, Row } from "react-bootstrap";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Moment from "react-moment";
import Login from "./LogIn";

const PostDetails = () => {
    const [posts, setPosts] = useState([])
    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const [shipperSelected, setShipperSelected] = useState()
    const [user, dispatch] = useContext(UserContext);
    const [updateCount, setUpdateCount] = useState(0);
    const { postId } = useParams()
    const [loading, setLoading] = useState(false)
    const [price, setPrice] = useState();
    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showAuctions, setShowAuctions] = useState(-1);
    const [showButton, setShowButton] = useState(false);
    const navigate = useNavigate();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);
    useEffect(() => {
        const loadPosts = async () => {
            let res = await authAxios().get(endpoints['post-id'](postId))
            setPosts(res.data);
            setTitle(res.data.title)
            setDescription(res.data.description)
            if (user.id !== res.data.customers.id || res.data.active === false)
            {
                setShowAuctions(false);
                setShowButton(false)
            } else {
                setShowAuctions(true);
                setShowButton(true)
            }
            
            // if (res.data.active === false)
            // {
            //     setShowAuctions(false);
            //     setShowButton(true);
            // } else {
            //     setShowAuctions(true);
            // }
            
        }
        // const loadShipper = async() => {
        //     const res = authAxios().get['order-id'](postId)
        //     setShipperSelected(res.data)
        // }
        // {console.log(shipperSelected)}
        // loadShipper()
        loadPosts();
    }, [price, updateCount]);
    // if (posts.active === false) {

    //     useEffect(() => {
    //         const loadShipper = async () => {
    //             const res = await authAxios().get(endpoints['order-id'](postId))
    //             setShipperSelected(res.data)
    //         }
    //         loadShipper()
    //         { console.log(shipperSelected) }
    //     }, [postId])
    // }
    // useEffect(() => {
    //     if (posts.active === false) {
    //       const loadShipper = async() => {
    //         const res = await authAxios().get(endpoints['order-id'](postId))
    //         setShipperSelected(res.data)
    //       }
    //       loadShipper()
    //       {console.log(shipperSelected)}
    //     }
    //   }, [postId, posts.active])
      
    const postAuction = async (event) => {
        event.preventDefault()
        let data = new FormData();
        data.append("price", price);
        try {
            setLoading(true);
            setShow(false);
            const res = await authAxios().post(endpoints["post-auctions"](postId),data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });

            if (res.status === 201) {
                alert("Hệ thống đã ghi nhận số tiền đấu giá");
            }
            else
                alert("Hệ thống đang có lỗi! Vui lòng quay lại sau!")

        } catch (error) {
            alert( error.response.data.detail);
        } finally {
            setLoading(false)
        }
    }      

    const chooseShipper = async(event, shipperId) => {
        event.preventDefault();
        try {
            const res = await authAxios().post(endpoints['post-shipper'](postId), { shipper_id: shipperId });
            if (res.status === 200) {
                alert("Chọn shipper thành công"); 
                window.location.reload();         
            } else {
                alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
            }
        } catch (error) {
            alert(error.message);
        }
    }

    const deletePost = async (event) =>{
        event.preventDefault();

        try {
            setShow(false)
            const res = await authAxios().delete(endpoints['post-id'](postId));
            setPosts([]); // hoặc setPosts([]) nếu bạn muốn đặt lại state là một mảng rỗng
            if (res.status === 204) {
                alert('Xóa bài viết thành công')
                navigate("/posts/?active=true");
            }
            
          } catch (error) {
            console.log(error);
          }
    }

    const updatePost = async (event) => {
        event.preventDefault();

        const res = await authAxios().patch(endpoints['post-id'](postId),
            {
                title: title,
                description: description
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }, setLoading(true))

        if (res.status === 200) {
            alert("Thay đổi thành công! ");
            // setDescription(res.data.description);
            // setTitle(res.data.title)
            setLoading(false)
            setShowEdit(false)
            setUpdateCount(updateCount + 1);
        }
    }

    const ckfinderConfig = {
        language: 'vi',
        ckfinder: {
            uploadUrl: 'https://ckeditor.com/apps/ckfinder/3.5.0/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',
            // uploadUrl: 'http://127.0.0.1:8000/upload_image/?upload',
            openerMethod: 'popup',
            popupWidth: 800,
            popupHeight: 600,
            filebrowserUploadMethod: 'xhr',
            filebrowserUploadUrl: 'http://127.0.0.1:8000/upload_image/?upload',
            image: {
                maxHeight: 600,
                maxWidth: 400
              },
        }
    };    

    if (user === null)
        return <Navigate to={"/login"} />
    
   return (
    <Container>
           <Row className="justify-content-center align-items-center">
               <Col xs={12} key={posts.id} className="p-2">
                   <Card style={{ width: '50rem' }}>
                       <Card.Body>
                           <Card.Title>{posts.title}</Card.Title>
                           <Card.Text dangerouslySetInnerHTML={{ __html: posts.description }}></Card.Text>
                       </Card.Body>
                   </Card>
                   {showButton && user.user_type === 'customer' && (
                    <Row className="m-1 p-1 align-items-center justify-content-end">
                       <Col xs={12} md={4}>
                               <Button className="mr-2" variant="primary" onClick={handleShowEdit}>Sửa</Button>
                               <Modal show={showEdit} onHide={handleCloseEdit}>
                                   <Modal.Header closeButton>
                                       <Modal.Title>Sửa bài viết</Modal.Title>
                                   </Modal.Header>
                                   <Modal.Body>
                                       <Form >
                                           <Form.Group className="mb-3" controlId="formBasicEmail">
                                               <Form.Label>Tiêu đề</Form.Label>
                                               <Form.Control type="text" placeholder="Tiêu đề"
                                                   value={title} onChange={(evt) => setTitle(evt.target.value)} />
                                           </Form.Group>

                                           <Form.Group className="mb-3" controlId="formBasicEmail">
                                               <Form.Label>Nội dung</Form.Label>
                                           </Form.Group>
                                           <CKEditor
                                               editor={ClassicEditor}
                                               data={description}
                                               config={ckfinderConfig}
                                               onChange={(event, editor) => {
                                                   const data = editor.getData();
                                                   setDescription(data);
                                               }} />
                                           {loading ? <Loading /> : <Button variant="primary" type="submit" onClick={updatePost}>Sửa</Button>}
                                           <Button variant="secondary" onClick={handleCloseEdit}>Đóng</Button>
                                       {/* <Button variant="primary" >Sửa</Button> */}
                                       </Form>
                       
                                   </Modal.Body>
                                   {/* <Modal.Footer>
                                       <Button variant="secondary" onClick={handleCloseEdit}>Đóng</Button>
                                       <Button variant="primary" >Sửa</Button>
                                   </Modal.Footer> */}
                               </Modal>
                               <Button variant="danger" onClick={handleShow}>Xóa</Button>

                               <Modal show={show} onHide={handleClose}>
                                   <Modal.Header closeButton>
                                       <Modal.Title>Cảnh báo</Modal.Title>
                                   </Modal.Header>
                                   <Modal.Body>
                                       <p>Bạn có chắc chắn xóa bài viết</p>
                                   </Modal.Body>
                                   <Modal.Footer>
                                       <Button variant="secondary" onClick={handleClose}>Đóng</Button>
                                       <Button variant="danger" onClick={deletePost}>Xóa</Button>
                                   </Modal.Footer>
                               </Modal>
                           </Col>
                       </Row>
                   )}

                   {showAuctions && user && user.user_type === 'customer' && posts.auctions && posts.auctions.map(auction =>
                   <>
                       <Row className="bg-light m-1 p-1 align-items-center">
                           <Col xs={3} md={1}>
                               <Image src={auction.shippers.image} alt={auction.shippers.username} rounded fluid />
                           </Col>
                           <Col xs={9} md={11} className="d-flex justify-content-between">
                               <Container>
                                   <p>{auction.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                   <small>{auction.shippers.username} đấu giá lúc <Moment fromNow>{auction.created_date}</Moment></small>
                               </Container>
                               <Container><Button onClick={(event) => chooseShipper(event, auction.shippers.id)}>Chọn</Button></Container>
                           </Col>
                       </Row></>
                   )}

 
                   {user && user.user_type === 'shipper' && (
                       <>
                           <Button variant="primary" onClick={handleShow}>Đấu giá</Button>

                           <Modal show={show} onHide={handleClose}>
                               <Modal.Header closeButton>
                                   <Modal.Title>Vui lòng nhập số tiền đấu giá</Modal.Title>
                               </Modal.Header>
                               <Modal.Body>
                                   <Form>
                                       <Form.Group className="mb-3" controlId="formBasicEmail">
                                           <Form.Label>Số tiền</Form.Label>
                                           <Form.Control type="number" placeholder="Số tiền đấu giá"
                                                value={price} 
                                                onChange={evt =>  setPrice(evt.target.value) } />
                                           {/* <Form.Control
                                               type="number"
                                               placeholder="Số tiền đấu giá"
                                               value={price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                               onChange={evt => setPrice(evt.target.value.replace(/\D/g, ''))}
                                           /> */}
                                           <Button variant="secondary" onClick={handleClose}>Đóng</Button>
                                           <Button variant="primary" onClick={postAuction}>Đấu giá</Button>
                                       </Form.Group>
                                   </Form>
                               </Modal.Body>
                           </Modal>

                           {posts.auctions && posts.auctions.map(auctions => (
                               <>
                                   {user.id === auctions.shippers.id && (
                                       <Row className="bg-light m-1 p-1">
                                           <Col xs={3} md={1}>
                                               <Image src={auctions.shippers.image} alt={auctions.shippers.username} rounded fluid />
                                           </Col>
                                           <Col xs={9} md={11}>
                                               <p>{auctions.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                               <small>Bạn đấu giá lúc <Moment fromNow>{auctions.created_date}</Moment> </small>
                                           </Col>
                                       </Row>
                                   )}
                               </>
                           ))}
                       </>
                   )}
                </Col>
            </Row>
    </Container>
   )
}


export default PostDetails