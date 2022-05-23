import { useState, useEffect, React } from "react";
import Header from "./admin/common/header";
import Notiflix from "notiflix";
import Moment from "moment";
import Swal from "sweetalert2";
import { Col, Container, Button, Row } from "react-bootstrap";

import getUrl from "../utils/routes";
import axios from "axios";

const EventList = () => {
  const [list, setList] = useState([]);

  const getList = async () => {
    Notiflix.Loading.standard("Loading Events");
    let resp = await axios.post(getUrl("listActiveEvent"));
    setList(resp.data);
    Notiflix.Loading.remove();
  };

  useEffect(() => {
    getList();
  }, []);

  const getUserData = () => {
    return JSON.parse(localStorage.getItem("user"));
  };

  const enrollUser = async (eventrec) => {
    try {
      Notiflix.Loading.standard();
      const resp=await axios.post(getUrl("addEnroll"), {
        user: getUserData().id,
        nic: getUserData().nic,
        event: eventrec,
      });
      if(resp.status===200){
        Swal.fire('You have enrolled with this event');
      }else{
        Swal.fire('Already registered with this event');
      }
      Notiflix.Loading.remove();
    } catch (error) {
      Notiflix.Loading.remove();
      if(error.status===400){
        Swal.fire('Already registered with this event');
      }
    }
  };

  return (
    <>
      <Header />
      <Container className="shadow-sm text-success mt-5 p-4 rounded">
        <Row className="justify-content-start mt-5">
          <Col md={12} sm={12}>
            <h4 className=" text-success pb-4">Events</h4>
          </Col>
          {list.map((item, index) => (
            <Col md={6} sm={12} className="shadow-sm text-success p-4 rounded">
              <h5 className=" text-success pb-4">{item.title}</h5>
              <p className="text-dark">{item.description}</p>
              <h6 className="text-danger">
                Starts On :{" "}
                {Moment(item.startdatetime).format("D/MM/Y hh:mm A")}
              </h6>
              <Button
                onClick={() => enrollUser(item._id)}
                className="mt-4"
                variant="success"
                type="submit"
              >
                Enroll to this event
              </Button>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default EventList;
