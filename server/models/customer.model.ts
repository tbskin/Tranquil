/* Import the Mongoose software module */
import mongoose from "mongoose";

/* Create a Mongoose Schema object for generating
       document rules as to what structure MUST be 
       expected when requesting/sending data to and from 
       the MongoDB database collection */

/* Define the schema rules (field names, types and rules) */
const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true, max: 50 },
  qr_id: { type: String },
});

/* Export model for application usage */
export default mongoose.model("Customer", CustomerSchema);
