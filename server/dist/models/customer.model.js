"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Import the Mongoose software module */
const mongoose_1 = __importDefault(require("mongoose"));
/* Create a Mongoose Schema object for generating
       document rules as to what structure MUST be
       expected when requesting/sending data to and from
       the MongoDB database collection */
/* Define the schema rules (field names, types and rules) */
const CustomerSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, max: 50 },
    qr_id: { type: String },
});
/* Export model for application usage */
exports.default = mongoose_1.default.model("Customer", CustomerSchema);
//# sourceMappingURL=customer.model.js.map