import React from "react";
import { Container, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <>
      <footer
        className="footer mt-auto py-3 bg-dark text-white"
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          width: "100%",
          height: "60px" /* Height of the footer */,
          //textAlign: "center",
        }}
      >
        <div className="container">
          &copy; {new Date().getFullYear()} Copyright: EasyAgro-Agrarian
          Service.
        </div>
      </footer>
    </>
  );
};

export default Footer;
