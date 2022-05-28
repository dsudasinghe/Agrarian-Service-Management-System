import React from "react";
import { Container, Row, Image, Col } from "react-bootstrap";
import Header from "./admin/common/header";
import Footer from "./admin/common/footer";
import image from "../assets/landing.jpg";
//import Map from "./admin/map";

const Landingpage = () => {
  return (
    <>
      <Header />
      <Container
        style={{ marginBottom: "90px", textAlign: "center", marginTop: "30px" }}
      >
        <Row>
          <h3 className="text-secondary">
            Welcome to EasyAgro Agrarian Service!
          </h3>
          <p
            className="text-secondary"
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            The Department of Agrarian Development was established on 01st
            October 1957 with the objective of providing necessary facilities to
            Sri Lankan farmer community abolishing the hitherto existed Food
            Department. This department empowered by the Paddy Lands Act No. 46
            of 1958 is currently functions as the Department of Agrarian
            Development as per the Agrarian Development Act No. 46 of 2000 and
            its subsequent amendments.
          </p>
          <Image src={image}></Image>
        </Row>
        {/*<Row className="justify-content-center mt-5">
          <Col className="shadow-sm text-secondary mt-5 p-4 rounded">
            <h6>Shop Online.</h6>
          </Col>
          <Col className="shadow-sm text-secondary mt-5 p-4 rounded">
            <h6>Events.</h6>
          </Col>
          <Col className="shadow-sm text-secondary mt-5 p-4 rounded">
            <h6>Special Announcement.</h6>
          </Col>
          <Col className="shadow-sm text-secondary mt-5 p-4 rounded">
            <h6>Apply for Loans.</h6>
          </Col>
        </Row> AIzaSyBheNEtrngM3cbowGS3tLPwoBXlswmmSb0
*/}
        {/*<Container style={{ width: "100px", hight: "100px" }}>
          <Map></Map>
        </Container>*/}
      </Container>
      <Footer></Footer>
    </>
  );
};

export default Landingpage;
