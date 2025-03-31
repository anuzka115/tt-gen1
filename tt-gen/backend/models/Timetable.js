import mongoose from "mongoose";

const TimetableSchema = new mongoose.Schema({
  data: [[String]], // 2D array for 22x13 timetable
});

export default mongoose.model("Timetable", TimetableSchema);
