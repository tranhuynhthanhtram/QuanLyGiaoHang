import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { UserContext } from "../App";
import { useContext, useEffect, useRef, useState } from "react";
import API, { authAxios, endpoints } from "../configs/API";
import Loading from "../layouts/Loading/Loading";
import { Button, ButtonGroup, Card, Col, Container, Form, Image, Modal, Row } from "react-bootstrap";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Moment from "react-moment";

const Home = () => {
    const [user, dispatch] = useContext(UserContext);
    const [posts, setPosts] = useState(null)
    const [postsForm, setPostsForm] = useState({
        title: "",
        description: "",
    });
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [q] = useSearchParams()
    const change = (obj) => {
        setPostsForm({
            ...postsForm,
            ...obj,
        });
    };

    useEffect(() => {
        const loadPosts = async () => {
            try {                
                    let e = `${endpoints['posts']}?page=${page}`
    
                    let active = q.get("active")
                    if (active !== null)
                        e += `&active=${active}`

                    let user = q.get("user")
                    if (user !== null)
                        e += `&user=${user}`

                    let res = await authAxios().get(e)
                    setPosts(res.data.results.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)))
            } catch (ex) {
                console.log(ex)
                setPage(1)
            }
        }
        setPosts(null)
        loadPosts()
    }, [page, q])

    const nextPage = () => setPage(current => current + 1)
    const prevPage = () => setPage(current => current - 1)

    if (user === null)
        return <Navigate to="/login" />

    if (posts === null)
        return <Loading />

    const postForm = async (event) => {
        event.preventDefault();
        let data = new FormData();

        data.append("title", postsForm.title);
        data.append("description", postsForm.description);

        try {
            const res = await authAxios().post(endpoints["posts"], data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }, setLoading(true));

            if (res.status === 201) {
                alert("Đăng bài thành công");
                setPostsForm({
                    title: "",
                    description: "",
                });
                setPosts([res.data, ...posts]);
            }
            else
                alert("Hệ thống đang có lỗi! Vui lòng quay lại sau!")

        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false)
        }
    }
   
    const ckfinderConfig = {
        language: 'vi',
        ckfinder: {
            uploadUrl: 'https://ckeditor.com/apps/ckfinder/3.5.0/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',
            // uploadUrl: 'http://127.0.0.1:8000/upload_image/',
            openerMethod: 'popup',
            popupWidth: 800,
            popupHeight: 600,
            filebrowserUploadMethod: 'xhr',
            filebrowserUploadUrl: 'http://127.0.0.1:8000/upload_image/',
            // image: {
            //     maxHeight: 600,
            //     maxWidth: 400
            //   },
            image: {
                styles: [
                  'alignLeft', 'alignCenter', 'alignRight'
                ],
                toolbar: [
                  'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
                  '|', 'imageTextAlternative'
                ],
                outputType: 'json',
                insertImageAsBase64URI: false
              },
              
        }
        
    };   {console.log(ckfinderConfig)} 

    

    return (
        <Container>
            {user && user.user_type === 'customer' && (
                <Form onSubmit={postForm} > 
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Tiêu đề</Form.Label>
                        <Form.Control type="text" placeholder="Tiêu đề"
                            value={postsForm.title} onChange={evt => change({ title: evt.target.value })} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Nội dung</Form.Label>
                    </Form.Group>
                    <CKEditor
                        editor={ClassicEditor}
                        data={postsForm.description}
                        config={ckfinderConfig}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            change({ description: data });
                        }} />
                        <p></p>
                    {loading ? <Loading /> : <Button variant="primary" type="submit">Đăng bài</Button>}
                    <hr></hr>
                </Form>
            )}
           
            <Row className="justify-content-center align-items-center">
                {posts.map(posts => {
                    return (<Col xs={12} key={posts.id} className="p-2">
                        <Card style={{ width: '50rem' }}>
                            <Card.Body>
                                <Card.Subtitle>
                                    <Row className=" m-1 p-1">
                                        <Col xs={3} md={1}>
                                            <Image src={posts.customers.image} alt={posts.customers.username} rounded fluid style={{ maxWidth: 30 }} />
                                        </Col>
                                        <Col xs={9} md={11}>
                                            <h5>{posts.customers.username}</h5>
                                            <small>Đăng cách đây <Moment fromNow>{posts.created_date}</Moment> </small>
                                            <hr></hr>
                                        </Col>
                                    </Row>
                                </Card.Subtitle>
                                <Card.Title>{posts.title}</Card.Title>
                                <Card.Text dangerouslySetInnerHTML={{ __html: posts.description }}></Card.Text>

                                <Link to={`/posts/${posts.id}`} className="btn btn-primary">Xem chi tiết</Link>
                            </Card.Body>
                        </Card>
                    </Col>)
                })}
            </Row>

            <ButtonGroup aria-label="Basic example" className="mt-2">
                <Button onClick={prevPage} variant="outline-primary">&lt;&lt;</Button>
                <Button onClick={nextPage} variant="outline-primary">&gt;&gt;</Button>
            </ButtonGroup>

        </Container>
    )
}

export default Home