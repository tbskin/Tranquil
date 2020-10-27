"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Set up
const express_1 = __importDefault(require("express")); // create our app w/ express
const body_parser_1 = __importDefault(require("body-parser")); // pull information from HTML POST (express4)
const morgan_1 = __importDefault(require("morgan")); // log requests to the console (express4)
const method_override_1 = __importDefault(require("method-override")); // simulate DELETE and PUT (express4)
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose")); // mongoose for mongodb
// Configuration
mongoose_1.default.connect("mongodb://localhost/customers", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const port = 9000;
const app = express_1.default();
app.use(morgan_1.default("dev"));
app.use(body_parser_1.default.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(body_parser_1.default.json()); // parse application/json
app.use(body_parser_1.default.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json
app.use(method_override_1.default());
app.use(cors_1.default());
var CustomerSchema = new mongoose_1.default.Schema({
    name: String,
    qr_id: String,
});
// Models
const Customer = mongoose_1.default.model("Customer", CustomerSchema);
// Get a customer's details
app.get("/api/customers/:id", function (req, res) {
    var ObjectId = require("mongoose").Types.ObjectId;
    console.log("fetching customer");
    console.log(req.params.id);
    Customer.findById(new ObjectId(req.params.id.toString().slice(1)), function (err, customers) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err);
        res.json(customers); // return all customers in JSON format
    });
    // Customer.find(function (err: any, customers) {
    //   // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    //   if (err) res.send(err);
    //   res.json(customers); // return all customers in JSON format
    // });
});
// Get all customers details
app.get("/api/customers", function (req, res) {
    console.log("fetching customers");
    // use mongoose to get all customers in the database
    Customer.find(function (err, customers) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err);
        res.json(customers); // return all customers in JSON format
    });
});
// create customer and send back all customers after creation
app.post("/api/customers", function (req, res) {
    console.log("creating customer");
    // create a customer, information comes from request from Ionic
    Customer.create({
        name: req.body.name,
        qr_id: req.body.qr_id,
    }, function (err, customer) {
        if (err)
            res.send(err);
        // get and return all the customers after you create another
        Customer.find(function (err, customers) {
            if (err)
                res.send(err);
            res.json(customers);
        });
    });
});
// Delete a customer
app.delete("/api/customers/:cust_id", function (req, res) {
    Customer.remove({
        _id: req.params.cust_id,
    }, function (err) {
        if (err)
            res.send(err);
        res.json({ "Delete successful": true });
    });
});
// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
//# sourceMappingURL=server.js.map