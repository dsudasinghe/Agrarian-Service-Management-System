import { React } from "react";
import Swal from "sweetalert2";
import { Container, NavDropdown, Navbar, Nav } from "react-bootstrap";

const Header = () => {
  const doLogout = () => {
    Swal.fire({
      title: "Are you sure to logout",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location = "/";
      }
    });
  };

  const getUserData = () => {
    return JSON.parse(localStorage.getItem("user"));
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/home">EasyAgro-Agrarian Service</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/announcementslist">Anouncements</Nav.Link>
            <Nav.Link href="/eventslist">Events</Nav.Link>
            <Nav.Link href="/admin/orders">My Orders</Nav.Link>
            <Nav.Link href="/admin/loans">Loans</Nav.Link>
            <Nav.Link href="/admin/advisors">Ask Question</Nav.Link>

            {(getUserData().usertype === 1 || getUserData().usertype === 2) && (
              <NavDropdown title="Enrollment" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/categories">
                  Categories
                </NavDropdown.Item>
                <NavDropdown.Item href="/products">Products</NavDropdown.Item>
                <NavDropdown.Item href="/orders">Orders</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/events">Events</NavDropdown.Item>
                <NavDropdown.Item href="/announcements">
                  Announcements
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/admin/loans">Loans</NavDropdown.Item>
                <NavDropdown.Item href="/admin/orders">Orders</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/admin/advisors">
                  Advisors
                </NavDropdown.Item>

                {getUserData().usertype === 1 && <NavDropdown.Divider />}
                {getUserData().usertype === 1 && (
                  <NavDropdown.Item href="/users">Users</NavDropdown.Item>
                )}
              </NavDropdown>
            )}
          </Nav>
          <Nav>
            <NavDropdown
              title={getUserData().name}
              id="collasible-nav-dropdown"
            >
              <NavDropdown.Item onClick={doLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
