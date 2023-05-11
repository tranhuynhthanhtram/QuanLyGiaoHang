import { authAxios, endpoints } from "../configs/API";

const Auction = () => {
    // const {postId} = useParams()
    // const postAuction = async(event) => {
    //     event.preventDefault();
    //     try {
    //         const res = await authAxios().post(endpoints["post-auctions"](postId),
    //         {
    //             price: price
    //         },
    //         {
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //             }
    //         }, setLoading(true));

    //         if (res.status === 201) {
    //             alert("Hệ thống đã ghi nhận số tiền đấu giá");
    //         }
    //         else
    //             alert("Hệ thống đang có lỗi! Vui lòng quay lại sau!")

    //     } catch (error) {
    //         alert(error.message);
    //     } finally {
    //         setLoading(false)
    //     }
    // }
    return (<h1>helo</h1>
        // <Modal
            
        //     // backdrop="static"
        //     // backdrop={false}
        //     // backdropStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.7)'}}
        //     // style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        //         size="sm"
        //         show={smShow}
        //         onHide={() => setSmShow(false)}
        //         aria-labelledby="example-modal-sizes-title-sm"
        //     >
        //         <Modal.Header>
        //             <Modal.Title id="example-modal-sizes-title-lg">
        //                 Small Modal
        //             </Modal.Title>
        //         </Modal.Header>
        //         <Modal.Body>
        //             <Form onSubmit={postAuction}>
        //                 <Form.Group className="mb-3" controlId="formBasicPassword">
        //                     <Form.Label>Giá tiền</Form.Label>
        //                     <Form.Control type="number" placeholder="Giá tiền"
        //                         value={price}
        //                         onChange={(evt) => setPrice(evt.target.value)} />
        //                 </Form.Group>
        //                 <Button onClick={() => setSmShow(false)} className="me-2">Đóng</Button>
        //             </Form>
        //         </Modal.Body>
        //     </Modal>
            
       
    )
}
export default Auction