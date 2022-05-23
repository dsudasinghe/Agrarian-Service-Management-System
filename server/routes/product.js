const router = require("express").Router();
const multer = require("multer");
const { Product, validate } = require("../models/product");

let imageName = "";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "images");
    },
    filename: function(req, file, cb) {
        imageName =
            Date.now() + new Date().getTime() + '.jpg';
        cb(null, imageName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

let upload = multer({ storage, fileFilter });


router.route('/add').post(upload.single('image'), async(req, resp) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return resp.status(400).send({ message: error.details[0].message });
        }
        await new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            image: imageName,
            status: req.body.status,
        }).save();
        return resp.status(201).send({ message: "Successfully Registered" });
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.route('/updateWithImage').post(upload.single('image'), async(req, resp) => {
    try {

        await Product.find({ _id: req.body.id }).update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            image: imageName,
            status: req.body.status,
        });

        return resp.status(201).send({ message: "Successfully Registered" });
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/update", async(req, resp) => {
    try {
        await Product.find({ _id: req.body.id }).update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            status: req.body.status,
        });
        return resp.status(201).send({ message: "Successfully Updated" });
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});


router.post("/delete", async(req, resp) => {
    try {
        await Product.find({ _id: req.body.id }).remove();
        return resp.status(200).send({ message: "Successfully Deleted" });
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});


router.post("/one", async(req, resp) => {
    try {
        const data = await Product.findOne({ _id: req.body.id });
        return resp.status(data ? 200 : 400).send(data);
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/list", async(req, resp) => {
    try {
        const data = await Product.find();
        return resp.status(200).send(data);
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/active/list", async(req, resp) => {
    try {
        const data = await Product.find({ status: 1, quantity: { $gte: 1 } });
        return resp.status(200).send(data);
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

module.exports = router;