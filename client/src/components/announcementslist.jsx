import { useState, useEffect, React } from "react";
import Header from "./admin/common/header";
import Notiflix from "notiflix";
import Moment from "moment";
import { Col, Container, Row } from "react-bootstrap";
import Footer from "./admin/common/footer";

import getUrl from "../utils/routes";
import axios from "axios";

const AnnouncementList = () => {
  const [list, setList] = useState([]);

  const getList = async () => {
    Notiflix.Loading.standard("Loading Announcements");
    let resp = await axios.post(getUrl("listActiveAnnouncement"));
    setList(resp.data);
    Notiflix.Loading.remove();
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <>
      <Header />
      <Container
        className="shadow-sm text-success mt-5 p-4 rounded"
        style={{ marginBottom: "90px" }}
      >
        <Row className="justify-content-start mt-5">
          <Col md={12} sm={12}>
            <h4 className=" text-success pb-4">Announcements</h4>
          </Col>
          {list.map((item, index) => (
            <Col md={6} sm={12} className="shadow-sm text-success p-4 rounded">
              <h5 className=" text-success pb-4">{item.title}</h5>
              <p className="text-dark">{item.description}</p>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer></Footer>
    </>
  );
};

export default AnnouncementList;
