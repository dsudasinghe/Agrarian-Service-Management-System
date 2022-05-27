import { useState, useEffect, React } from "react";
import Header from "./common/header";
import Notiflix from "notiflix";
import Swal from "sweetalert2";
import {
  Col,
  Table,
  Container,
  Row,
  Modal,
  Form,
  Button,
  Alert,
} from "react-bootstrap";

import getUrl from "../../utils/routes";
import axios from "axios";
import Footer from "./common/footer";

const Categories = () => {
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [products, setProducts] = useState([]);

  const getUserData = () => {
    return JSON.parse(localStorage.getItem("user"));
  };

  const getList = async () => {
    Notiflix.Loading.standard("Loading Categories");

    let isadmin = 2;

    if (getUserData().usertype == 1 || getUserData.usertype == 2) {
      isadmin = 1;
    }

    let resp = await axios.post(getUrl("orderList"), {
      isadmin: isadmin,
      user: getUserData().id,
    });

    setList(resp.data);
    Notiflix.Loading.remove();
  };

  useEffect(() => {
    getList();
  }, []);

  const handleGet = async (record) => {
    setProducts(JSON.parse(record.products));
    setShow(true);
  };
  const handleClose = (record) => {
    setShow(false);
  };

  return (
    <>
      <Header />
      <Container fluid style={{ marginBottom: "90px" }}>
        <Row className="justify-content-center mt-5">
          <Col
            md={9}
            sm={12}
            className="shadow-sm text-success mt-5 p-4 rounded"
          >
            <h6 className=" text-success pb-4">Orders List</h6>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Reference</th>
                  <th>Delivery Address</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.length == 0 && (
                  <tr className="text-center">
                    <td className="text-danger" colSpan={4}>
                      No Data Found
                    </td>
                  </tr>
                )}
                {list.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.ref}</td>
                    <td>{item.address}</td>
                    <td>{item.total}</td>
                    <td>
                      <Button
                        className="mx-1"
                        variant="primary"
                        size="sm"
                        onClick={() => handleGet(item)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
      <Footer></Footer>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {list.length == 0 && (
                <tr className="text-center">
                  <td className="text-danger" colSpan={5}>
                    No Data Found
                  </td>
                </tr>
              )}
              {products.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.cart_qty}</td>
                  <td>{item.price * item.cart_qty}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Categories;
