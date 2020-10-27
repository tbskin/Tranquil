"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Set up
const express_1 = __importDefault(require("express")); /* Import the ExpressJS framework for Middleware/routing */
const body_parser_1 = __importDefault(require("body-parser")); /* Import Body Parser module for enabling data from POST requests
to be extracted and parsed */
const mongoose_1 = __importDefault(require("mongoose")); /* Import Mongoose for enabling communication with MongoDB and
management of data handling tasks */
const customer_model_1 = __importDefault(require("../models/customer.model"));
// Import the server configuration file
const config_json_1 = __importDefault(require("../config/config.json"));
const QRService_1 = require("../services/QRService");
/* Import the File System module for enabling File I/O operations */
// fs = require("fs"),
// /* Import PDFKit module to dynamically generate and publish PDF
//      documents for the application */
// pdfKit = require("pdfkit"),
// /* Import path module to provide utilities for working with file
//      and directory paths */
// path = require("path"),
// /* Define Mongoose connection to project's MongoDB database */
// connection = mongoose.connect(config.database, { useMongoClient: true }),
// /* Import Schema for managing MongoDB database communication
//      with Mongoose */
// gallery = require("./models/gallery");
// Configuration
mongoose_1.default.connect(config_json_1.default.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
const app = express_1.default();
/* Use ExpressJS Router class to create modular route handlers */
const apiRouter = express_1.default.Router();
// app.use(logger("dev"));
app.use(body_parser_1.default.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(body_parser_1.default.json()); // parse application/json
// app.use(methodOverride());
// app.use(cors());
/* Manage CORS Access for ALL requests/responses */
app.use(function (req, res, next) {
    /* Allow access from any requesting client */
    res.setHeader("Access-Control-Allow-Origin", "*");
    /* Allow access for any of the following Http request types */
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    /* Set the Http request header */
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,Authorization");
    next();
});
// Get all customers details
apiRouter.get("/customers", (req, res) => {
    customer_model_1.default.find((err, result) => {
        if (err) {
            console.log(err);
        }
        res.json({ records: result });
    });
});
// Get a single customer's details
apiRouter.get("/customers/:id", (req, res) => {
    customer_model_1.default.findById(req.params.id, (err, record) => {
        if (err) {
            console.log(err);
        }
        res.json({ records: record });
    });
});
apiRouter.post("/customers", (req, res) => {
    let customerName = req.body.name;
    let qrId = getUniqueQRId();
    customer_model_1.default.create({ name: customerName, qr_id: qrId }, (err, records) => {
        if (err) {
            console.log(err);
        }
        res.json({ message: "SUCCESS" });
    });
});
function getUniqueQRId() {
    return QRService_1.QRService.generateQR();
    // while (Customer.exists({ qr_id: qrId })) {
    //   qrId = QRService.generateQR();
    // }
}
apiRouter.put("/customers/:customerId", (req, res) => {
    let qrId = getUniqueQRId();
    customer_model_1.default.findOneAndUpdate({ _id: req.params.customerId }, { qr_id: qrId }, { new: true }, (err, customerRecord) => {
        if (err) {
            res.status(500).send(err);
        }
        res.json({ records: customerRecord });
    });
});
apiRouter.delete("/customers/:customerId", (req, res) => {
    customer_model_1.default.findOneAndDelete({ _id: req.params.customerId }, (err, customerRecord) => {
        if (err) {
            console.log("Customer record delete failed");
        }
        res.json({ records: customerRecord });
    });
});
/* Mount the specified Middleware function based on matching path
   ALL Http requests will be sent to /api followed by whatever the
   requested endpoint is
*/
app.use("/api", apiRouter);
// listen (start app with npm start) ======================================
app.listen(config_json_1.default.node_port);
console.log("App listening on port " + config_json_1.default.node_port);
//# sourceMappingURL=server.js.map