// routes/industryRoutes.js
const express = require('express');
const router = express.Router();
const Industry = require('../models/Industry');
const cloudinary = require('cloudinary').v2; // Import Cloudinary
const config = require('../config'); // Import Cloudinary configuration
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
});

// Multer storage configuration
const storage = multer.memoryStorage(); // Store images in memory for uploading to Cloudinary
const upload = multer({ storage: storage }).fields([
  { name: 'icon', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]);

// Add a new industry
router.post('/add', upload, async (req, res) => {
  const { title } = req.body;
  const icon = req.files['icon'][0].buffer;
  const iconContentType = req.files['icon'][0].mimetype;
  const image = req.files['image'][0].buffer;
  const imageContentType = req.files['image'][0].mimetype;

  // Check if the 'active' checkbox was checked
  const active = req.body.active === 'on'; // Convert 'on' to true, otherwise false

  try {
    const newIndustry = new Industry({
      title,
      icon: { data: icon, contentType: iconContentType },
      image: { data: image, contentType: imageContentType },
      active // Assign the boolean value
    });

    await newIndustry.save();
    req.session.message = "Industry added successfully";
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.session.message = err.message;
    res.redirect('/');
  }
});


// Route for Editing Industry
router.get('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const industry = await Industry.findById(id);
    if (!industry) {
      console.error("Industry not found");
      return res.redirect("/");
    }
    res.render("editIndustry", {
      title: "Edit Industry",
      industry: industry,
      iconUrl: industry.icon.url, // Pass the icon URL
      imageUrl: industry.image.url, // Pass the image URL
      message: req.session.message // Pass the message variable
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});



// Route for Updating Industry
router.post('/update/:id', upload, async (req, res) => {
  try {
    const id = req.params.id;
    const { title, active } = req.body;
    const updatedIndustry = {
      title,
      active: active === 'on' ? true : false
    };

    // Check if icon and image files were uploaded
    if (req.files['icon'] && req.files['icon'].length > 0) {
      updatedIndustry.icon = {
        data: req.files['icon'][0].buffer,
        contentType: req.files['icon'][0].mimetype
      };
    }
    if (req.files['image'] && req.files['image'].length > 0) {
      updatedIndustry.image = {
        data: req.files['image'][0].buffer,
        contentType: req.files['image'][0].mimetype
      };
    }

    await Industry.findByIdAndUpdate(id, updatedIndustry);
    req.session.message = {
      type: 'success',
      message: 'Industry updated successfully!'
    };
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: 'danger',
      message: err.message
    };
    res.redirect("/");
  }
});

// Route for Deleting Industry
router.get('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Industry.findByIdAndDelete(id);
    req.session.message = "Industry deleted successfully";
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.session.message = err.message;
    res.redirect("/");
  }
});

// Display form to add a new industry
router.get('/add', (req, res) => {
  res.render('addIndustry', { message: req.session.message }); // Pass the message variable to the view
});


router.get('/', async (req, res) => {
  try {
    const industries = await Industry.find().exec();
    res.render("index", {
      title: "Home Page",
      industries: industries,
      message: req.session.message // Pass the message variable to the view
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Display form to add a new industry
router.get('/addfilter', (req, res) => {
  res.render('addFilter', { message: req.session.message }); // Pass the message variable to the view
});

// Display form to add a new industry
router.get('/editfilter', (req, res) => {
  res.render('editFilter', { message: req.session.message }); // Pass the message variable to the view
});


module.exports = router;
