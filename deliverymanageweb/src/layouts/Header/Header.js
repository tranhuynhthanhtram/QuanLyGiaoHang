import React, { useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import "./styleHeader.css";
import { Button, Container, Dropdown, Image, Nav, Navbar } from "react-bootstrap";


const Header = () => {
    const nav = useNavigate();
    const [user, dispatch] = useContext(UserContext);
    const navigate = useNavigate();

    const chooseDropdownOrder = (event) => {
        const value = event.currentTarget.getAttribute('value');
        navigate(`/order/?ship=${value}`);
    }

    const chooseDropdownPost = (event) => {
        const value = event.currentTarget.getAttribute('value');
        navigate(`/posts/?active=${value}&user=${user.id}`);
    }

    const logout = (event) => {
        event.preventDefault();
        dispatch({ type: "logout" });
        nav("/login");
    };
    let userInfo;

    if (user !== null)
        userInfo = (
            <>
                <Nav className="ml-auto">
                    <Link className="nav-link text-danger" to={`/profile/${user.id}`}>
                        <Image src={user.image} alt={user.username} width="30" className="rounded-circle" />
                        {user.username}
                    </Link>
                    <Button className="btn btn-danger" onClick={logout}>&#128104; Đăng xuất</Button>
                </Nav>
            </>
        )
    else
        userInfo = (
            <>
                <Nav className="ml-auto">
                    <Link className="nav-link text-danger" style={{ float: 'right' }} to="/login">&#128104; Đăng nhập</Link>
                    <Link className="nav-link text-success" style={{ float: 'right' }} to="/register">&#128073; Đăng ký</Link>
                </Nav>
            </>
        )

  return (
      <>
      <Navbar bg="light" expand="lg">
          <Container>
              <Link to="/posts/?active=true" className="navbar-brand">&#9997; Delivery</Link>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                  <Link className="nav-link active" to="/posts/?active=true">&#127968; Trang chủ</Link>
                {/* {user && user.user_type === 'shipper' && ( */}
                     {/* <Link className="nav-link active" to="/order/">&#127968; Quản lý đơn hàng</Link>  */}
                              <Dropdown>
                                  <Dropdown.Toggle variant="link" id="dropdown-basic" style={{ textDecoration: 'none', boxShadow: 'none', backgroundColor: 'transparent', color: 'black' }}>
                                      Quản lý đơn hàng
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                      <Dropdown.Item onClick={chooseDropdownOrder} value="unshipped">Chưa giao</Dropdown.Item>
                                      <Dropdown.Item onClick={chooseDropdownOrder} value="shipped">Đã giao</Dropdown.Item>
                                  </Dropdown.Menu>
                                 
                              </Dropdown>
                {/* )} */}
                {user && user.user_type === 'customer' && (
                    <Dropdown>
                    <Dropdown.Toggle variant="link" id="dropdown-basic" style={{ textDecoration: 'none', boxShadow: 'none', backgroundColor: 'transparent', color: 'black' }}>
                        Quản lý bài viết
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={chooseDropdownPost} value="true">Đang đấu giá</Dropdown.Item>
                        <Dropdown.Item onClick={chooseDropdownPost} value="false">Đã đấu giá</Dropdown.Item>
                    </Dropdown.Menu>
                   
                </Dropdown>
                )}
              </Nav>
              {userInfo}
              </Navbar.Collapse>
          </Container>
          </Navbar>
      </>
  )
};

export default Header;