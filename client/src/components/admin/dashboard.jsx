import { useState, useEffect, React } from "react";
import getUrl from "../../utils/routes";
import axios from "axios";
import Notiflix from "notiflix";
import Header from "./common/header";
import {
  Col,
  Modal,
  Container,
  Row,
  Table,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import Footer from "./common/footer";
import Swal from "sweetalert2";
import { PayPalButton } from "react-paypal-button-v2";

const Home = () => {
  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [product, setProduct] = useState(null);
  const [cartFullTotal, setCartFullTotal] = useState(0);
  const [shipping, setShipping] = useState("");

  const getList = async () => {
    Notiflix.Loading.standard("Loading Products");
    let resp = await axios.post(getUrl("ActiveListProduct"));
    setList(resp.data);
    Notiflix.Loading.remove();
  };

  useEffect(() => {
    getList();
  }, []);

  const handleClose = () => {
    setShowModal(false);
  };
  const showProduct = (productRecord) => {
    setShowModal(true);
    setProduct(productRecord);
  };

  const initialData = {
    name: "",
    description: "",
    price: "",
    quantity: "",
    status: 1,
  };

  const addToCart = (productObj) => {
    let productsCart = JSON.parse(localStorage.getItem("cart"));
    if (productsCart.length > 0) {
      let checkExists = false;
      var eleIndex = 0;
      productsCart.forEach(function (cartItem) {
        if (productObj._id === cartItem._id) {
          if (productObj.quantity > productObj["cart_qty"]) {
            productObj["cart_qty"] = productObj["cart_qty"] + 1;
            productsCart[eleIndex] = productObj;
          }
          checkExists = true;
        }
        eleIndex++;
      });

      if (checkExists == false) {
        productObj["cart_qty"] = 1;
        productsCart.push(productObj);
      }
    } else {
      productObj["cart_qty"] = 1;
      productsCart.push(productObj);
    }
    localStorage.setItem("cart", JSON.stringify(productsCart));
    Swal.fire({
      icon: "success",
      title: "Product Added to the cart.",
    });
    console.log(productsCart);
  };
  const handleCartModalClose = () => {
    setShowCartModal(false);
  };

  const handleCheckout = () => {
    handleCartModalClose();
    setShowPaymentModal(true);
  };

  const handleCheckoutClose = () => {
    setShowPaymentModal(false);
  };

  const getUserData = () => {
    return JSON.parse(localStorage.getItem("user"));
  };

  var cartTotal = 0.0;

  return (
    <>
      <Header></Header>
      <Container fluid style={{ marginBottom: "90px" }}>
        <Row className="justify-content-center mt-5">
          <Col md={12}>
            <Button
              onClick={() => {
                cartTotal = 0.0;

                JSON.parse(localStorage.getItem("cart")).forEach(function (
                  ele
                ) {
                  cartTotal += Number(ele.cart_qty * ele.price);
                });

                console.log(cartTotal);
                setCartFullTotal(cartTotal);

                setShowCartModal(true);
              }}
              className="mt-4 pull-right"
              variant="primary"
              type="submit"
            >
              View Cart
            </Button>
          </Col>
          {list.map((item, index) => (
            <Col
              md={2}
              sm={12}
              className="shadow-sm text-success mt-5 p-4 rounded"
            >
              <img
                className="w-100"
                onClick={() => {
                  showProduct(item);
                }}
                src={require("../../../../server/images/" + item.image)}
              />
              <h6 style={{ marginTop: "20px" }}>{item.name}</h6>
              <p className="text-danger">LKR {item.price}</p>
              <h6>{item.quantity} Available</h6>
              <Button
                onClick={() => addToCart(item)}
                className="mt-4 w-100"
                variant="primary"
                type="submit"
              >
                Add to cart
              </Button>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer></Footer>

      {product && (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{product.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              className="w-100 mb-3"
              src={require("../../../../server/images/" + product.image)}
            ></img>

            <p>{product.description}</p>

            <p className="text-primary">{product.quantity} Available</p>
            <h4 className="text-danger">LKR {product.price}</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Modal show={showCartModal} onHide={handleCartModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cart</Modal.Title>
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
              {JSON.parse(localStorage.getItem("cart")).map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.cart_qty}</td>
                  <td>{item.price * item.cart_qty} LKR</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCartModalClose}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              localStorage.setItem("cart", JSON.stringify([]));
              handleCartModalClose();
            }}
          >
            Clear Cart
          </Button>
          <Button variant="primary" onClick={handleCheckout}>
            Checkout ({cartFullTotal})
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPaymentModal} onHide={handleCheckoutClose}>
        <Modal.Header closeButton>
          <Modal.Title>Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*<Form.Group className="mb-3" controlId="ownerNameGroup">
            <Form.Label>Owner Name</Form.Label>
            <Form.Control required type="text" placeholder="Enter owner name" />
          </Form.Group>*/}
          <Form.Group className="mb-3" controlId="deliveryAddressGroup">
            <Form.Label>Delivery Address</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter delivery address"
              onChange={(e) => {
                setShipping(e.target.value);
                console.log(shipping);
              }}
            />
          </Form.Group>
        </Modal.Body>
        {/* <Form.Group className="mb-3" controlId="cardNumberGroup">
            <Form.Label>Card Number</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter card number"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="cardYearGroup">
            <Form.Label>Year</Form.Label>
            <Form.Control required type="number" placeholder="Enter Year" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="cardMonthGroup">
            <Form.Label>Month</Form.Label>
            <Form.Control required type="text" placeholder="Enter month" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="cvcGroup">
            <Form.Label>CVC</Form.Label>
            <Form.Control required type="text" placeholder="Enter cvc" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCheckoutClose}>
            Close
          </Button>*/}
        {/* {transaction && (
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={async () => {
                handleCheckoutClose();

                Notiflix.Loading.standard("Payment Processing");

                await axios.post(getUrl("addOrder"), {
                  cart: localStorage.getItem("cart"),
                  user: getUserData().id,
                  total: cartFullTotal,
                  address: shipping,
                });
                localStorage.setItem("cart", JSON.stringify([]));
                Notiflix.Loading.remove();
                getList();
              }}
            >
              Pay
            </Button>
          </Modal.Footer>
        )}*/}
        <Container>
          <PayPalButton
            amount={(cartFullTotal / 360).toFixed(2)}
            shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
            onSuccess={async (details) => {
              //alert(
              // "Transaction completed by " + details.payer.name.given_name
              //);
              Swal.fire({
                icon: "warning",
                title:
                  "Transaction completed by " + details.payer.name.given_name,
              });
              handleCheckoutClose();
              Notiflix.Loading.standard("Payment Processing");
              await axios.post(getUrl("addOrder"), {
                cart: localStorage.getItem("cart"),
                user: getUserData().id,
                total: cartFullTotal,
                address: shipping,
              });
              localStorage.setItem("cart", JSON.stringify([]));
              Notiflix.Loading.remove();
              getList();
              Swal.fire({
                icon: "success",
                title: "Payment Succuss! ", //+ details.payer.name.given_name,
              });
            }}
            options={{
              clientId:
                "AWSlYfZ8E8WQJ3zhbEEVxCEkcADqV0E_L1wcydgijdeWJqCOGN31zVXXQ4ZPOVO3uKlhnMsqjhOPuUvF",
              currency: "USD",
            }}
          />
        </Container>
      </Modal>
    </>
  );
};

export default Home;
