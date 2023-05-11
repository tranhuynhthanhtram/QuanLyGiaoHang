import { Link, useSearchParams } from "react-router-dom";
import { authAxios, endpoints } from "../configs/API";
import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import moment from "moment/moment";
import { UserContext } from "../App";
import { useContext } from "react";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [user, dispatch] = useContext(UserContext);
    const [q] = useSearchParams()

    // const order = async (eventKey, event) => {
    //     event.preventDefault()
    //     const res = await authAxios().get(`/orders/?=shipped`)
    //     setOrders(res.data)
    // }
    // useEffect(() => {
    //     const loadOrder = async () => {
    //         try {
    //             let e = `${endpoints['order']}?`

    //             let shipped = q.get("ship")
    //             if (shipped !== null)
    //                 e += `ship=${shipped}`

    //             let res = await authAxios().get(e)
    //             setOrders(res.data)
    //             if (res.data.length === 0)
    //             alert('Không có đơn hàng nào')

    //         } catch (ex) {
    //             console.log(ex)
    //         } 
    //     }
    //     loadOrder()
        
    // }, [q])
    const loadOrder = async () => {
        try {
          let e = `${endpoints['order']}?`
      
          let shipped = q.get("ship")
          if (shipped !== null)
            e += `ship=${shipped}`
      
          let res = await authAxios().get(e)
          setOrders(res.data)
          
          if (res.data.length === 0)
            alert('Không có đơn hàng nào')
      
        } catch (ex) {
          console.log(ex)
        } 
      }
      
      useEffect(() => {
        loadOrder();
      }, [q]);

    const changeOrderStatus = async (orderId, status) => {
        try {
            const res = await authAxios().patch(`order/${orderId}/`, {
                active: status
            })
            if (res.data === 200)
            alert('Đơn hàng đã giao')
            await loadOrder(); 
            // Thực hiện các xử lý cập nhật UI nếu cần
        } catch (error) {
            console.error(error);
        }
    }
    
    

    return (
        <Container>
            {user.user_type === 'shipper' && (
                <Table striped>
                <thead>
                    <tr>
                        <th>Đơn hàng</th>
                        <th>Ngày đặt</th>
                        <th>Trạng thái</th>
                        <th>Khách hàng</th>
                    </tr>
                </thead>

                <tbody>
                    {orders && orders.map(order => {
                        return (
                            <tr>
                                <td>{order.posts}</td>
                                <td>{moment(order.created_at).format('DD/MM/YYYY')}</td>
                                <td style={{ textAlign: 'center' }}>
                                    {order.active ? (
                                        <input type="checkbox" checked disabled />
                                    ) : (
                                        <input type="checkbox" checked={false} onClick={() => changeOrderStatus(order.posts, !order.active)}/>
                                    )}
                                </td>
                                <td>{order.customers.username}</td>
                            </tr>)
                    })}
                </tbody>
            </Table>
            )}
            {user.user_type === 'customer' && (
                <Table striped>
                <thead>
                    <tr>
                        <th>Đơn hàng</th>
                        <th>Ngày đặt</th>
                        <th>Shipper</th>
                    </tr>
                </thead>

                <tbody>
                    {orders && orders.map(order => {
                        return (
                            <tr>
                                <td><Link to={`/posts/${order.posts}`}>{order.posts}</Link></td>
                                <td>{moment(order.created_at).format('DD/MM/YYYY')}</td>
                                
                                <td>{order.shippers.username}</td>
                            </tr>)
                    })}
                </tbody>
            </Table>
            )}

            {/* <Table striped>
                <thead>
                    <tr>
                        <th>Đơn hàng</th>
                        <th>Ngày đặt</th>
                        <th>Trạng thái</th>
                        <th>Khách hàng</th>
                    </tr>
                </thead>

                <tbody>
                    {orders && orders.map(order => {
                        return (
                            <tr>
                                <td>{order.posts}</td>
                                <td>{moment(order.created_at).format('DD/MM/YYYY')}</td>
                                <td style={{ textAlign: 'center' }}>
                                    {order.active ? (
                                        <input type="checkbox" checked disabled />
                                    ) : (
                                        <input type="checkbox" checked={false} onClick={() => changeOrderStatus(order.posts, !order.active)}/>
                                    )}
                                </td>
                                <td>{order.customers.username}</td>
                            </tr>)
                    })}
                </tbody>
            </Table> */}
        </Container>

    )
}
export default Order