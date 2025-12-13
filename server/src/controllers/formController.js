const { parseForm } = require('../services/markdownParser');
const logger = require('../utils/logger');

/**
 * Get a form by ID
 * GET /api/forms/:formId
 */
async function getForm(req, res) {
  try {
    const { formId } = req.params;

    logger.info('Fetching form', { formId });

    const form = await parseForm(formId);

    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found',
      });
    }

    res.json({
      success: true,
      data: form,
    });
  } catch (error) {
    logger.error('Error fetching form', {
      formId: req.params.formId,
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      error: 'Failed to load form',
    });
  }
}

module.exports = {
  getForm,
};
