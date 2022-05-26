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

const Announcement = () => {
  const [list, setList] = useState([]);

  const handleEnrollment = async (e) => {
    e.preventDefault();
    try {
      console.log(data);
      Notiflix.Loading.standard();
      if (isnew === false) {
        data["id"] = recordid;
      }
      await axios.post(
        getUrl(isnew === true ? "addAnnouncement" : "updateAnnouncement"),
        data
      );
      setData(initialData);
      setIsnew(true);
      setError({
        message: "Announcement Processed Successfully",
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
    Notiflix.Loading.standard("Loading Events");
    let resp = await axios.post(getUrl("listAnnouncement"));
    setList(resp.data);
    Notiflix.Loading.remove();
  };

  useEffect(() => {
    getList();
  }, []);

  const initialData = {
    title: "",
    description: "",
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
      await axios.post(getUrl("deleteAnnouncement"), { id: record });
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
      let response = await axios.post(getUrl("getAnnouncement"), {
        id: record,
      });
      if (response.status === 200) {
        setIsnew(false);
        setRecordid(response.data._id);
        setData({
          title: response.data.title,
          description: response.data.description,
          status: response.data.status,
        });
      }
      Notiflix.Loading.remove();
    });
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
            <h6 className=" text-success pb-4">Announcement List</h6>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Status</th>
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
                    <td>{item.title}</td>
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
            <h6 className=" text-success pb-4">Add / Update Announcement</h6>

            <Form className="text-start" onSubmit={handleEnrollment}>
              <Form.Group className="mb-3" controlId="nameGroup">
                <Form.Label>Announcement Title</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  name="title"
                  value={data.title}
                  type="text"
                  placeholder="Enter announcement title"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="descriptionGroup">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  placeholder="Enter announcement content"
                  name="description"
                  value={data.description}
                  as="textarea"
                  rows={3}
                />
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

export default Announcement;
