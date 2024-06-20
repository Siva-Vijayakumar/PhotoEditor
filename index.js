// index.js

import express from 'express';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(express.json());

// Route to serve the index.ejs file
app.get('/', (req, res) => {
  res.render('index', { imageUrl: '/images/sun.jpg' });
});

// Route to handle image adjustments
app.post('/adjust', async (req, res) => {
  try {
    const { contrast, brightness, saturation, hue } = req.body;
    const imageUrl = path.join(__dirname, 'public', 'images', 'sun.jpg');

    // Use Sharp to adjust contrast, brightness, saturation, and hue
    const adjustedImageBuffer = await sharp(imageUrl)
      .modulate({
        brightness: parseFloat(brightness),
        contrast: parseFloat(contrast),
        saturation: parseFloat(saturation),
        hue: parseInt(hue)
      })
      .toBuffer();

    // Save the adjusted image to a temporary file
    const adjustedImagePath = path.join(__dirname, 'public', 'adjusted.jpg');
    fs.writeFileSync(adjustedImagePath, adjustedImageBuffer);

    // Send back the URL where the adjusted image can be viewed
    const adjustedImageUrl = '/adjusted.jpg';
    res.send(adjustedImageUrl);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
