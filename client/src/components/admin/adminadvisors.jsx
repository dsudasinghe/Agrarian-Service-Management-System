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

const AdminAdvisors = () => {
  const [list, setList] = useState([]);

  const getUserData = () => {
    return JSON.parse(localStorage.getItem("user"));
  };

  const handleEnrollment = async (e) => {
    e.preventDefault();
    try {
      console.log(data);
      Notiflix.Loading.standard();
      data["user"] = getUserData().id;
      await axios.post(getUrl("newQuestion"), data);
      setData(initialData);
      setError({
        message: "Advice Processed Successfully",
        color: "success",
      });
      Notiflix.Loading.remove();
      getList();
    } catch (error) {
      Notiflix.Loading.remove();
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
    Notiflix.Loading.standard("Loading Advises");

    let isadmin = 2;

    if (getUserData().usertype == 1 || getUserData.usertype == 2) {
      isadmin = 1;
    }

    let resp = await axios.post(getUrl("listQuestion"), {
      isadmin: isadmin,
      user: getUserData().id,
    });

    console.log(resp.data);
    setList(resp.data);
    Notiflix.Loading.remove();
  };

  useEffect(() => {
    getList();
  }, []);

  const initialData = {
    message: "",
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

  const reply = async (idRecord) => {
    Swal.fire({
      title: "Reply",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      preConfirm: (replytext) => {
        return replytext;
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (replytext) => {
      if(replytext.value!=''){
        try {
          Notiflix.Loading.standard();
          await axios.post(getUrl("replyQuestion"), {id:idRecord,reply:replytext.value,staff:getUserData().id});
          setError({
            message: "Reply Processed Successfully",
            color: "success",
          });
          Notiflix.Loading.remove();
          getList();
        } catch (error) {
          Notiflix.Loading.remove();
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
      }
    });
  };

  return (
    <>
      <Header />
      <Container fluid>
        <Row className="justify-content-center mt-5">
          <Col
            md={9}
            sm={12}
            className="shadow-sm text-success mt-5 p-4 rounded"
          >
            <h6 className=" text-success pb-4">Question List</h6>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Answer</th>

                  {(getUserData().usertype == 1 ||
                    getUserData().usertype == 2) && <th>Actions</th>}
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
                    <td>{item.message}</td>
                    <td>{item.reply}</td>
                    {(getUserData().usertype == 1 ||
                      getUserData().usertype == 2) && (
                      <td>
                        <Button
                          className="mx-1"
                          variant="primary"
                          size="sm"
                          onClick={()=>{
                            reply(item._id);
                          }}
                        >
                          Reply
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          {getUserData().usertype==3 && <Col
            md={3}
            sm={12}
            className="shadow-sm text-success mt-5 p-4 rounded"
          >
            <h6 className=" text-success pb-4">Ask Question</h6>

            <Form className="text-start" onSubmit={handleEnrollment}>
              <Form.Group className="mb-3" controlId="nameGroup">
                <Form.Label>Your Question</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  placeholder="Enter your question"
                  name="message"
                  value={data.message}
                  as="textarea"
                  rows={3}
                />
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
          </Col>}
        </Row>
      </Container>
    </>
  );
};

export default AdminAdvisors;
