const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let components = [
  { id: 1, name: "Arduino Uno", total: 10, available: 10 },
  { id: 2, name: "IR Sensor", total: 20, available: 20 },
  { id: 3, name: "DC Motor", total: 15, available: 15 },
];

let borrowRecords = [];

// ===== GET COMPONENTS =====
app.get("/components", (req, res) => {
  res.json(components);
});

// ===== BORROW COMPONENT =====
app.post("/borrow", (req, res) => {
  const { studentName, className, year, componentId, quantity } = req.body;

  const component = components.find(
    c => c.id === Number(componentId)
  );

  if (!component) {
    return res.status(404).json({ message: "Component not found" });
  }

  if (component.available < Number(quantity)) {
    return res.status(400).json({ message: "Not enough stock" });
  }

  component.available -= Number(quantity);

  borrowRecords.push({
    studentName,
    className,
    year,
    componentName: component.name,
    quantity: Number(quantity),
    date: new Date().toLocaleString()
  });

  res.json({ message: "Component borrowed successfully" });
});

// ===== RETURN COMPONENT =====
app.post("/return", (req, res) => {
  const { recordIndex } = req.body;

  if (recordIndex === undefined) {
    return res.status(400).json({ message: "Record index required" });
  }

  const record = borrowRecords[recordIndex];

  if (!record) {
    return res.status(404).json({ message: "Record not found" });
  }

  const component = components.find(
    c => c.name === record.componentName
  );

  if (component) {
    component.available += record.quantity;
  }

  borrowRecords.splice(recordIndex, 1);

  res.json({ message: "Component returned successfully" });
});

// ===== GET BORROW RECORDS =====
app.get("/records", (req, res) => {
  res.json(borrowRecords);
});

// ===== ADD NEW COMPONENT (ADMIN) =====
app.post("/add-component", (req, res) => {
  const { name, total } = req.body;

  if (!name || !total) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newComponent = {
    id: components.length + 1,
    name,
    total: Number(total),
    available: Number(total)
  };

  components.push(newComponent);

  res.json({ message: "Component added successfully" });
});

app.listen(5000, () => {
  console.log("Demo Backend Running on port 5000 🚀");
});