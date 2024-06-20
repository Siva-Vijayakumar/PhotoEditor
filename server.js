import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(express.json());

// Route to serve the index.ejs file
app.get('/', (req, res) => {
  res.render('index', { imageUrl: null });
});

// Route to handle file upload
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.render('index', { imageUrl });
});

// Route to handle image adjustments
app.post('/adjust', async (req, res) => {
  try {
    const { imageUrl, contrast, brightness, saturation, hue } = req.body;
    const decodedUrl = decodeURIComponent(imageUrl);
    const imagePath = path.join(__dirname, 'public', decodedUrl);

    // Check if the file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).send('File not found');
    }

    // Use Sharp to adjust contrast, brightness, saturation, and hue
    const adjustedImageBuffer = await sharp(imagePath)
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
