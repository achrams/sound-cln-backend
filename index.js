const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 40001;
const { v4 } = require("uuid");
const uuid = v4;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// User
app.get("/user", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    res.status(200).json(db.user);
  });
});

// Items
app.get("/items", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    res.status(200).json(db.items);
  });
});

app.post("/items", (req, res) => {
  const newItem = { ...req.body, id: uuid() };
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    db.items.push(newItem);
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      res.status(201).json(newItem);
    });
  });
});

app.put("/items/:id", (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    const idx = db.items.findIndex((item) => item.id === itemId);
    if (idx === -1) return res.status(404).send("Item not found");
    db.items[idx] = { ...db.items[idx], ...updatedItem };
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      res.status(201).json(db.items[idx]);
    });
  });
});

app.delete("/items/:id", (req, res) => {
  const itemId = req.params.id;
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    const idx = db.items.findIndex((item) => item.id === itemId);
    if (idx === -1) return res.status(404).send("Item not found");
    db.items.splice(idx, 1);
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      res.status(204).send();
    });
  });
});

// Packages
app.get("/packages", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    res.status(200).json(db.packages);
  });
});

app.post("/packages", (req, res) => {
  const newPackage = { ...req.body, id: uuid() };
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    db.packages.push(newPackage);
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      res.status(201).json(newPackage);
    });
  });
});

app.put("/packages/:id", (req, res) => {
  const packageId = req.params.id;
  const updatedPackage = req.body;
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    const idx = db.packages.findIndex((pkg) => pkg.id === packageId);
    if (idx === -1) return res.status(404).send("Package not found");
    db.packages[idx] = { ...db.packages[idx], ...updatedPackage };
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      res.status(200).json(db.packages[idx]);
    });
  });
});

app.delete("/packages/:id", (req, res) => {
  const packageId = req.params.id;
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    const idx = db.packages.findIndex((pkg) => pkg.id === packageId);
    if (idx === -1) return res.status(404).send("Package not found");
    db.packages.splice(idx, 1);
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      res.status(204).send();
    });
  });
});

// Income (month & year optional)
app.get("/income", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");

    const { month, year } = req.query;
    const db = JSON.parse(data);
    let result = db.income;

    if (month && year) {
      result = result.filter((el) => {
        const date = new Date(el.createdAt);
        return (
          date.getMonth() + 1 === parseInt(month) &&
          date.getFullYear() === parseInt(year)
        );
      });
    }

    res.status(200).json(result);
  });
});

app.post("/income", (req, res) => {
  const newIncome = { ...req.body, id: uuid() };
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    db.income.push(newIncome);
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      res.status(201).json(newIncome);
    });
  });
});

// Expenses (month & year optional)
app.get("/expenses", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");

    const { month, year } = req.query;
    const db = JSON.parse(data);
    let result = db.expenses;

    if (month && year) {
      result = result.filter((el) => {
        const date = new Date(el.createdAt);
        return (
          date.getMonth() + 1 === parseInt(month) &&
          date.getFullYear() === parseInt(year)
        );
      });
    }

    res.status(200).json(result);
  });
});

// Invoices
app.get("/invoices", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    res.status(200).json(db.invoices);
  });
});

app.post("/invoices", (req, res) => {
  const newInvoice = { ...req.body, id: uuid() };
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    db.invoices.push(newInvoice);
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      res.status(201).json(newInvoice);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
