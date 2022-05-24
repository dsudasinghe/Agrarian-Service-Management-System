import { useState, React } from "react";
import { Link } from "react-router-dom";
import Notiflix from "notiflix";
import axios from "axios";
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

const Login = () => {
  const [data, setData] = useState({
    nic: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      Notiflix.Loading.standard();
      const { data: res } = await axios.post(getUrl("auth"), data);
      Notiflix.Loading.remove();
      console.log(res.data.user);
      console.log(res.message);
      localStorage.setItem("cart", JSON.stringify([]));
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location = "/";
    } catch (error) {
      Notiflix.Loading.remove();
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
            <h4 className=" text-success pb-5">EasyAgro User Login</h4>

            <Form className="text-start" onSubmit={handleSubmit}>
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
              <Form.Group className="mb-3" controlId="loginCheckGroup">
                <Form.Check type="checkbox" label="Remember Me" />
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
                to="/signup"
                className="text-center"
              >
                <Breadcrumb className="mt-4 text-success" href="/signup">
                  No account yet, Please register
                </Breadcrumb>
              </Link>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
