const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const pantryDataFile = 'pantry.json';

// Helper function to read pantry data from the JSON file
function loadPantryData() {
  try {
    const data = fs.readFileSync(pantryDataFile);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to save pantry data to the JSON file
function savePantryData(data) {
  fs.writeFileSync(pantryDataFile, JSON.stringify(data, null, 2));
}

// Create a new pantry item
app.post('/create', (req, res) => {
  const pantryData = loadPantryData();
  const newItem = req.body;

  if (!newItem.id || !newItem.name || !newItem.quantity) {
    return res.status(400).json({ message: 'Invalid request: Please provide id, name, and quantity for the new item' });
  }

  pantryData.push(newItem);
  savePantryData(pantryData);
  res.status(201).json({ message: 'Pantry item created successfully' });
});

// Read a specific pantry item by ID
app.get('/read/:id', (req, res) => {
  const pantryData = loadPantryData();
  const itemId = parseInt(req.params.id);

  const item = pantryData.find((entry) => entry.id === itemId);

  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Pantry item not found' });
  }
});

// List all pantry items
app.get('/list', (req, res) => {
  const pantryData = loadPantryData();
  res.json(pantryData);
});

// Update a pantry item by ID
app.put('/update/:id', (req, res) => {
  const pantryData = loadPantryData();
  const itemId = parseInt(req.params.id);
  const updatedItem = req.body;

  const index = pantryData.findIndex((entry) => entry.id === itemId);

  if (index !== -1) {
    pantryData[index] = updatedItem;
    savePantryData(pantryData);
    res.json({ message: 'Pantry item updated successfully' });
  } else {
    res.status(404).json({ message: 'Pantry item not found' });
  }
});

// Delete a pantry item by ID
app.delete('/delete/:id', (req, res) => {
  const pantryData = loadPantryData();
  const itemId = parseInt(req.params.id);

  const index = pantryData.findIndex((entry) => entry.id === itemId);

  if (index !== -1) {
    pantryData.splice(index, 1);
    savePantryData(pantryData);
    res.json({ message: 'Pantry item deleted successfully' });
  } else {
    res.status(404).json({ message: 'Pantry item not found' });
  }
});

app.listen(port, () => {
  console.log(`Pantry API is listening on port ${port}`);
});
