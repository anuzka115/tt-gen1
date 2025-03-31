import mongoose from "mongoose";

const TimetableSchema = new mongoose.Schema({
  data: [[String]], 
});

export default mongoose.model("Timetable", TimetableSchema);
