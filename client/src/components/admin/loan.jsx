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

const Loan = () => {
  const [list, setList] = useState([]);

  const handleEnrollment = async (e) => {
    e.preventDefault();
    try {
      data["user"] = getUserData().id;
      Notiflix.Loading.standard();
      await axios.post(getUrl("addLoan"), data);
      setData(initialData);
      setError({
        message: "Loan Processed Successfully",
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
    Notiflix.Loading.standard("Loading Loan Records");

    let isadmin = 2;

    if (getUserData().usertype == 1 || getUserData.usertype == 2) {
      isadmin = 1;
    }

    let resp = await axios.post(getUrl("listLoan"), {
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

  const getUserData = () => {
    return JSON.parse(localStorage.getItem("user"));
  };

  const initialData = {
    reason: "",
    user: getUserData()._id,
    nic: getUserData().nic,
    amount: "",
  };

  const [data, setData] = useState(initialData);

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
      await axios.post(getUrl("deleteLoan"), { id: record });
      Notiflix.Loading.remove();
      getList();
    });
  };

  const handleApprove = async (record,user) => {
    Swal.fire({
      title: "Are you sure to approve this record",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      Notiflix.Loading.standard();
      await axios.post(getUrl("approveLoan"), {
        id: record,
        user: user,
      });
      getList();
      Notiflix.Loading.remove();
    });
  };

  const handleReject = async (record,user) => {
    Swal.fire({
      title: "Are you sure to reject this record",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      Notiflix.Loading.standard();
      await axios.post(getUrl("rejectLoan"), {
        id: record,
        user: user,
      });
      getList();
      Notiflix.Loading.remove();
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
            <h6 className=" text-success pb-4">Categories List</h6>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Reason</th>
                  <th>Amount</th>
                  <th>Status</th>
                  {(getUserData().usertype == 1 ||
                    getUserData().usertype == 2) && <th>Actions</th>}
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
                    <td>{item.nic}</td>
                    <td>{item.reason}</td>
                    <td>{item.amount}</td>
                    <td>
                      <Badge
                        bg={["success", "danger", "warning"][item.status - 1]}
                      >
                        {["Approved", "Rejected", "Pending"][item.status - 1]}
                      </Badge>
                    </td>

                    {(getUserData().usertype == 1 ||
                      getUserData().usertype == 2) && (
                      <td>
                        <Button
                          className="mx-1"
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(item._id,item.user)}
                        >
                          Approve
                        </Button>
                        <Button
                          className="mx-1"
                          variant="primary"
                          size="sm"
                          onClick={() => handleReject(item._id,item.user)}
                        >
                          Reject
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
                    )}
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
            <h6 className=" text-success pb-4">Add Loan</h6>

            <Form className="text-start" onSubmit={handleEnrollment}>
              <Form.Group className="mb-3" controlId="loanamountGroup">
                <Form.Label>Loan Amount</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  name="amount"
                  value={data.amount}
                  type="number"
                  placeholder="Enter Loan name"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="titleGroup">
                <Form.Label>Loan Remark</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  name="reason"
                  value={data.reason}
                  type="text"
                  placeholder="Enter remark"
                />
              </Form.Group>
              {error && error.message && (
                <Alert key={error.color} variant={error.color}>
                  {error.message}
                </Alert>
              )}
              <Button className="mt-4 w-100" variant="success" type="submit">
                Apply For Loan
              </Button>
              <Button
                className="mt-4 w-100"
                variant="danger"
                type="button"
                onClick={() => {
                  setData(initialData);
                }}
              >
                Reset
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Loan;
