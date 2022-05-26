import { useState, useEffect, React } from "react";
import Header from "./common/header";
import Notiflix from "notiflix";
import Swal from "sweetalert2";
import {
  Col,
  Table,
  Container,
  Row,
  Badge,
  Form,
  Button,
  Alert,
} from "react-bootstrap";

import getUrl from "../../utils/routes";
import axios from "axios";
import Footer from "./common/footer";

const Products = () => {
  const [list, setList] = useState([]);

  const handleEnrollment = async (e) => {
    e.preventDefault();
    try {
      Notiflix.Loading.standard();

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("quantity", data.quantity);
      formData.append("image", image);
      formData.append("status", data.status);
      if (isnew === false) {
        formData.append("id", recordid);
      }
      await axios.post(
        getUrl(
          isnew === true
            ? "addProduct"
            : image === ""
            ? "updateProduct"
            : "updateProductWithImage"
        ),
        formData
      );
      setData(initialData);
      setIsnew(true);
      setError({
        message: "Product Processed Successfully",
        color: "success",
      });
      Notiflix.Loading.remove();
      getList();
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        setError({
          message: error.response.data.message,
          color: "danger",
        });
      }
    }
  };

  const getList = async () => {
    Notiflix.Loading.standard("Loading Products");
    let resp = await axios.post(getUrl("listProduct"));
    setList(resp.data);
    Notiflix.Loading.remove();
  };

  useEffect(() => {
    getList();
  }, []);

  const initialData = {
    name: "",
    description: "",
    price: "",
    quantity: "",
    status: 1,
  };

  const [data, setData] = useState(initialData);

  const [isnew, setIsnew] = useState(true);
  const [recordid, setRecordid] = useState(0);

  const [error, setError] = useState({
    message: "",
    color: "success",
  });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleDelete = async (record) => {
    Swal.fire({
      title: "Are you sure to delete this record",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      Notiflix.Loading.standard();
      await axios.post(getUrl("deleteProduct"), { id: record });
      Notiflix.Loading.remove();
      getList();
    });
  };

  const handleGet = async (record) => {
    Swal.fire({
      title: "Are you sure to edit this record",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      Notiflix.Loading.standard();
      let response = await axios.post(getUrl("getProduct"), { id: record });
      if (response.status === 200) {
        setIsnew(false);
        setRecordid(response.data._id);
        setData({
          name: response.data.name,
          price: response.data.price,
          description: response.data.description,
          quantity: response.data.quantity,
          status: response.data.status,
        });
      }
      Notiflix.Loading.remove();
    });
  };

  const [image, setImage] = useState([]);

  const handleImageChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
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
            <h6 className=" text-success pb-4">Product List</h6>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Available Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.length == 0 && (
                  <tr className="text-center">
                    <td className="text-danger" colSpan={6}>
                      No Data Found
                    </td>
                  </tr>
                )}
                {list.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <Badge bg={item.status == 1 ? "success" : "danger"}>
                        {item.status == 1 ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        className="mx-1"
                        variant="primary"
                        size="sm"
                        onClick={() => handleGet(item._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="mx-1"
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col
            md={3}
            sm={12}
            className="shadow-sm text-success mt-5 p-4 rounded"
          >
            <h6 className=" text-success pb-4">Add / Update Product</h6>

            <Form className="text-start" onSubmit={handleEnrollment}>
              <Form.Group className="mb-3" controlId="nameGroup">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  name="name"
                  value={data.name}
                  type="text"
                  placeholder="Enter product name"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="descriptionGroup">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  placeholder="Enter product description"
                  name="description"
                  value={data.description}
                  as="textarea"
                  rows={3}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="priceGroup">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  name="price"
                  value={data.price}
                  type="number"
                  placeholder="Enter product price"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="quantityGroup">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  name="quantity"
                  value={data.quantity}
                  type="number"
                  placeholder="Enter product quantity"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="quantityGroup">
                <Form.Label>Price</Form.Label>
                <Form.Control onChange={handleImageChange} type="file" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="statusGroup">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  onChange={handleChange}
                  name="status"
                  aria-label="Default select example"
                  value={data.status}
                >
                  <option value={1}>Active</option>
                  <option value={2}>Inactive</option>
                </Form.Select>
              </Form.Group>
              {error && error.message && (
                <Alert key={error.color} variant={error.color}>
                  {error.message}
                </Alert>
              )}
              <Button
                className="mt-4 w-100"
                variant={isnew ? "success" : "warning"}
                type="submit"
              >
                {isnew ? "Submit" : "Update"}
              </Button>
              <Button
                className="mt-4 w-100"
                variant="danger"
                type="button"
                onClick={() => {
                  setData(initialData);
                  setIsnew(true);
                }}
              >
                Reset
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>

      <Footer></Footer>
    </>
  );
};

export default Products;
