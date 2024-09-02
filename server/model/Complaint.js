import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  response: {
    type: String,
  },
});

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
