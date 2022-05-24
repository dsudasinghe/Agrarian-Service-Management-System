import { useState, React } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Col,
  Breadcrumb,
  Container,
  Row,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import getUrl from "../../utils/routes";
import axios from "axios";

const Signup = () => {
  const [data, setData] = useState({
    name: "",
    nic: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(data);
      if (data.password_confirmation === data.password) {
        await axios.post(getUrl("users"), data);
        navigate("/login");
      } else {
        setError("Password and confirmation does not same");
      }
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <>
      <Container>
        <Row className="justify-content-center mt-5">
          <Col
            md={4}
            sm={12}
            className="shadow-sm text-success mt-5 p-4 text-center text-center rounded"
          >
            <h4 className=" text-success pb-5">EasyAgro User SignUp</h4>

            <Form className="text-start" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="loginNICGroup">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  name="name"
                  value={data.name}
                  type="text"
                  placeholder="Enter Your Name"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="loginNICGroup">
                <Form.Label>NIC</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  maxLength={10}
                  name="nic"
                  value={data.nic}
                  type="text"
                  placeholder="Enter Your NIC"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="loginEmailGroup">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  name="email"
                  value={data.email}
                  type="text"
                  placeholder="Enter Your Email"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="loginPasswordGroup">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  name="password"
                  value={data.password}
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="loginPasswordConfirmationGroup"
              >
                <Form.Label>Retype Password</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  name="password_confirmation"
                  value={data.password_confirmation}
                  type="password"
                  placeholder="Retype Password"
                />
              </Form.Group>
              {error && (
                <Alert key="danger" variant="danger">
                  {error}
                </Alert>
              )}
              <Button className="mt-4 w-100" variant="success" type="submit">
                Submit
              </Button>
              <Link
                style={{ textDecoration: "none" }}
                to="/login"
                className="text-center"
              >
                <Breadcrumb className="mt-4 text-success" href="/login">
                  Already have an account, login now
                </Breadcrumb>
              </Link>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Signup;
