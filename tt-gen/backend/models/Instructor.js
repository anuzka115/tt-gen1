import mongoose from "mongoose";

const InstructorSchema = new mongoose.Schema({
  name: String,
  courses: [String],
});

export default mongoose.model("Instructor", InstructorSchema);
