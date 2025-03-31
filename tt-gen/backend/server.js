import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/timetableDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema for Instructors and Courses
const instructorSchema = new mongoose.Schema({
  name: String,
  courses: [String],
});

const timetableSchema = new mongoose.Schema({
  slots: [[String]], // 2D Array to store timetable data
});

// Slot-to-Day-Time Mapping
const slotTimeMapping = {
  A: {
    schedule: [
      { day: "Monday", time: "9:00 AM - 9:55 AM" },
      { day: "Tuesday", time: "9:00 AM - 9:55 AM" },
      { day: "Thursday", time: "9:00 AM - 9:55 AM" },
    ],
  },
  B: {
    schedule: [
      { day: "Wednesday", time: "10:00 AM - 10:55 AM" },
      { day: "Thursday", time: "10:00 AM - 10:55 AM" },
      { day: "Friday", time: "10:00 AM - 10:55 AM" },
    ],
  },
  C: {
    schedule: [
      { day: "Monday", time: "10:00 AM - 10:55 AM" },
      { day: "Wednesday", time: "9:00 AM - 9:55 AM" },
      { day: "Friday", time: "9:00 AM - 9:55 AM" },
    ],
  },
  D: {
    schedule: [
      { day: "Monday", time: "11:00 AM - 11:55 AM" },
      { day: "Tuesday", time: "10:00 AM - 10:55 AM" },
      { day: "Wednesday", time: "11:00 AM - 11:55 AM" },
    ],
  },
  E: {
    schedule: [
      { day: "Tuesday", time: "11:00 AM - 11:55 AM" },
      { day: "Thursday", time: "11:00 AM - 11:55 AM" },
      { day: "Friday", time: "11:00 AM - 11:55 AM" },
    ],
  },
  F: {
    schedule: [
      { day: "Tuesday", time: "12:00 PM - 12:55 PM" },
      { day: "Wednesday", time: "12:00 PM - 12:55 PM" },
      { day: "Thursday", time: "12:00 PM - 12:55 PM" },
    ],
  },
  G: {
    schedule: [
      { day: "Monday", time: "12:00 PM - 12:55 PM" },
      { day: "Thursday", time: "2:00 PM - 2:55 PM" },
      { day: "Friday", time: "12:00 PM - 12:55 PM" },
    ],
  },
  H: {
    schedule: [
      { day: "Monday", time: "2:00 PM - 2:55 PM" },
      { day: "Tuesday", time: "2:00 PM - 2:55 PM" },
      { day: "Wednesday", time: "2:00 PM - 2:55 PM" },
    ],
  },
  I: {
    schedule: [
      { day: "Monday", time: "3:00 PM - 3:55 PM" },
      { day: "Tuesday", time: "3:00 PM - 3:55 PM" },
      { day: "Wednesday", time: "3:00 PM - 3:55 PM" },
    ],
  },
  J: {
    schedule: [
      { day: "Monday", time: "4:00 PM - 4:55 PM" },
      { day: "Tuesday", time: "4:00 PM - 4:55 PM" },
      { day: "Wednesday", time: "4:00 PM - 4:55 PM" },
    ],
  },
  K: {
    schedule: [
      { day: "Monday", time: "5:00 PM - 5:55 PM" },
      { day: "Thursday", time: "3:00 PM - 3:55 PM" },
      { day: "Friday", time: "2:00 PM - 2:55 PM" },
    ],
  },
  L: {
    schedule: [
      { day: "Tuesday", time: "5:00 PM - 5:55 PM" },
      { day: "Thursday", time: "4:00 PM - 4:55 PM" },
      { day: "Friday", time: "4:00 PM - 4:55 PM" },
    ],
  },
  M: {
    schedule: [
      { day: "Wednesday", time: "5:00 PM - 5:55 PM" },
      { day: "Thursday", time: "5:00 PM - 5:55 PM" },
      { day: "Friday", time: "3:00 PM - 3:55 PM" },
    ],
  },
};

// Instructor & Timetable Models
const Instructor = mongoose.model("Instructor", instructorSchema);
const Timetable = mongoose.model("Timetable", timetableSchema);

// Route to add instructors and their courses
app.post("/api/instructors", async (req, res) => {
  try {
    const { name, courses } = req.body;
    const newInstructor = new Instructor({ name, courses });
    await newInstructor.save();
    res.json({ message: "Instructor added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding instructor" });
  }
});

// Route to get all instructors and courses
app.get("/api/instructors", async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ error: "Error fetching instructors" });
  }
});

// --- New API Route: Get Unique Courses ---
app.get("/api/courses", async (req, res) => {
    try {
      const instructors = await Instructor.find();
      let courses = [];
      instructors.forEach((instructor) => {
        if (instructor.courses) {
          courses.push(...instructor.courses);
        }
      });
      // Remove duplicates
      courses = [...new Set(courses)];
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Error fetching courses" });
    }
  });
  // --- End of New Route ---
  
  app.get("/api/faculty/:name", async (req, res) => {
    try {
      const facultyName = req.params.name.trim(); // Trim to avoid accidental spaces
  
      // Fetch courses from 'instructors' collection
      const faculty = await Instructor.findOne({ name: facultyName }).select("courses -_id"); // ✅ Use select()
  
      if (!faculty) {
        return res.status(404).json({ error: `No faculty found with name: ${facultyName}` });
      }
  
      res.json({ courses: faculty.courses || [] }); // Send courses as JSON
    } catch (error) {
      console.error("Error fetching faculty data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  

// Route to save generated timetable
app.post("/api/timetable", async (req, res) => {
  try {
    await Timetable.deleteMany(); // Clear previous timetable
    const newTimetable = new Timetable({ slots: req.body.slots });
    await newTimetable.save();
    res.json({ message: "Timetable saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error saving timetable" });
  }
});

// Route to fetch the last saved timetable
app.get("/api/timetable", async (req, res) => {
  try {
    const timetable = await Timetable.findOne();
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: "Error fetching timetable" });
  }
});

// Route to get the slot-to-time mapping
app.get("/api/slots", (req, res) => {
  res.json(slotTimeMapping);
});

app.delete("/api/timetable/reset", async (req, res) => {
  try {
    await Timetable.deleteMany({}); // Clears the generated timetable
    await Instructor.deleteMany({}); // Clears the instructors list
    res.json({ message: "Timetable and instructors data have been reset." });
  } catch (error) {
    console.error("Error resetting timetable:", error);
    res.status(500).json({ error: "Failed to reset timetable." });
  }
});


  

app.listen(5000, () => console.log("Server running on port 5000"));
