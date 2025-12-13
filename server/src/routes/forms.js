const express = require('express');
const router = express.Router();
const { getForm } = require('../controllers/formController');

// GET /api/forms/:formId - Get form configuration
router.get('/:formId', getForm);

module.exports = router;
