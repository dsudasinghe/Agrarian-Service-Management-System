require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const eventRoutes = require("./routes/events");
const announcementRoutes = require("./routes/announcement");
const eventEnrollRoutes = require("./routes/event_enroll");
const loanRoutes = require("./routes/loan");
const questionRoutes = require("./routes/questions");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

connection();

//middlewares
app.use(express.json());
app.use(
    cors({
        origin: "*",
        methods: ['GET', 'POST']
    })
);

//routes bind
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/event_enroll", eventEnrollRoutes);
app.use("/api/loan", loanRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);

const port = process.env.PORT || 8003;
app.listen(port, () => console.log("listning on port " + port));