import React from "react";
import { Container } from "react-bootstrap";
import Header from "./admin/common/header";
import Footer from "./admin/common/footer";

const Landingpage = () => {
  return (
    <>
      <Header />
      <Container style={{ marginBottom: "90px" }}>
        <h1>hello world</h1>
      </Container>
      <Footer></Footer>
    </>
  );
};

export default Landingpage;
