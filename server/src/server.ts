// Set up
import express from "express"; /* Import the ExpressJS framework for Middleware/routing */
import bodyParser from "body-parser"; /* Import Body Parser module for enabling data from POST requests
to be extracted and parsed */
import mongoose from "mongoose"; /* Import Mongoose for enabling communication with MongoDB and 
management of data handling tasks */
import Customer from "../models/customer.model";

// Import the server configuration file
import config from "../config/config.json";
import { QRService } from "../services/QRService";
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
mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const app = express();
/* Use ExpressJS Router class to create modular route handlers */
const apiRouter = express.Router();
// app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
// app.use(methodOverride());
// app.use(cors());

/* Manage CORS Access for ALL requests/responses */
app.use(function (req, res, next) {
  /* Allow access from any requesting client */
  res.setHeader("Access-Control-Allow-Origin", "*");

  /* Allow access for any of the following Http request types */
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");

  /* Set the Http request header */
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Authorization"
  );
  next();
});

// Get all customers details
apiRouter.get("/customers", (req, res) => {
  Customer.find((err, result) => {
    if (err) {
      console.log(err);
    }

    res.json({ records: result });
  });
});

// Get a single customer's details
apiRouter.get("/customers/:id", (req, res) => {
  Customer.findById(req.params.id, (err, record) => {
    if (err) {
      console.log(err);
    }

    res.json({ records: record });
  });
});

apiRouter.post("/customers", (req, res) => {
  let customerName = req.body.name;
  let qrId = getUniqueQRId();

  Customer.create({ name: customerName, qr_id: qrId }, (err, records) => {
    if (err) {
      console.log(err);
    }

    res.json({ message: "SUCCESS" });
  });
});

function getUniqueQRId() {
  return QRService.generateQR();
  // while (Customer.exists({ qr_id: qrId })) {
  //   qrId = QRService.generateQR();
  // }
}

apiRouter.put("/customers/:customerId", (req, res) => {
  let qrId = getUniqueQRId();

  Customer.findOneAndUpdate(
    { _id: req.params.customerId },
    { qr_id: qrId },
    { new: true },
    (err, customerRecord) => {
      if (err) {
        res.status(500).send(err);
      }

      res.json({ records: customerRecord });
    }
  );
});

apiRouter.delete("/customers/:customerId", (req, res) => {
  Customer.findOneAndDelete(
    { _id: req.params.customerId },
    (err, customerRecord) => {
      if (err) {
        console.log("Customer record delete failed");
      }

      res.json({ records: customerRecord });
    }
  );
});

/* Mount the specified Middleware function based on matching path 
   ALL Http requests will be sent to /api followed by whatever the 
   requested endpoint is
*/
app.use("/api", apiRouter);

// listen (start app with npm start) ======================================
app.listen(config.node_port);
console.log("App listening on port " + config.node_port);
