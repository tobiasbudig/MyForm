const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');
const logger = require('../utils/logger');

/**
 * Parse a markdown form file
 * @param {string} formId - The form ID (filename without extension)
 * @returns {Promise<Object>} Parsed form configuration
 */
async function parseForm(formId) {
  try {
    const filePath = path.join(__dirname, '..', '..', 'forms', `${formId}.md`);

    // Read file
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Parse frontmatter and content
    const { data: frontmatter, content } = matter(fileContent);

    // Split content by --- to get question blocks
    const questionBlocks = content.split(/\n---\n/).filter(block => block.trim());

    // Parse each question block
    const questions = questionBlocks.map((block, index) => {
      return parseQuestionBlock(block, index);
    }).filter(q => q !== null);

    return {
      id: formId,
      title: frontmatter.title || 'Untitled Form',
      description: frontmatter.description || '',
      welcome: frontmatter.welcome || {
        heading: 'Welcome',
        body: 'Please complete this form.',
        buttonText: 'Start',
      },
      thankYou: frontmatter.thankYou || {
        heading: 'Thank You!',
        body: 'Your responses have been submitted.',
      },
      questions,
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      logger.warn(`Form not found: ${formId}`);
      return null;
    }
    logger.error('Error parsing form', { formId, error: error.message, stack: error.stack });
    throw error;
  }
}

/**
 * Parse a single question block
 * @param {string} block - The question block text
 * @param {number} index - Question index
 * @returns {Object|null} Parsed question object
 */
function parseQuestionBlock(block, index) {
  try {
    const lines = block.trim().split('\n');

    // First line should be the question heading (# text)
    const questionLine = lines.find(line => line.startsWith('#'));
    if (!questionLine) {
      logger.warn(`Question block ${index} has no heading, skipping`);
      return null;
    }

    const questionText = questionLine.replace(/^#+\s*/, '').trim();

    // Parse metadata (lines starting with -)
    const metadata = {};
    const optionsList = [];
    const labelsList = [];
    const statementsList = [];
    let isParsingOptions = false;
    let isParsingLabels = false;
    let isParsingStatements = false;
    let currentOption = null; // For hierarchical options

    for (let i = 0; i < lines.length; i++) {
      const originalLine = lines[i];
      const line = originalLine.trim();

      if (line.startsWith('- type:')) {
        metadata.type = line.split(':')[1].trim();
        isParsingOptions = false;
        isParsingLabels = false;
        isParsingStatements = false;
      } else if (line.startsWith('- required:')) {
        metadata.required = line.split(':')[1].trim() === 'true';
        isParsingOptions = false;
        isParsingLabels = false;
        isParsingStatements = false;
      } else if (line.startsWith('- has_other:')) {
        metadata.has_other = line.split(':')[1].trim() === 'true';
        isParsingOptions = false;
        isParsingLabels = false;
        isParsingStatements = false;
      } else if (line.startsWith('- id:')) {
        metadata.id = line.split(':')[1].trim();
        isParsingOptions = false;
        isParsingLabels = false;
        isParsingStatements = false;
      } else if (line.startsWith('- placeholder:')) {
        metadata.placeholder = line.split(':', 2)[1].trim();
        isParsingOptions = false;
        isParsingLabels = false;
        isParsingStatements = false;
      } else if (line.startsWith('- help:')) {
        metadata.help = line.split(':', 2)[1].trim();
        isParsingOptions = false;
        isParsingLabels = false;
        isParsingStatements = false;
      } else if (line.startsWith('- explanation:')) {
        metadata.explanation = line.split(':', 2)[1].trim();
        isParsingOptions = false;
        isParsingLabels = false;
        isParsingStatements = false;
      } else if (line.startsWith('- depends_on:')) {
        metadata.depends_on = line.split(':')[1].trim();
        isParsingOptions = false;
        isParsingLabels = false;
        isParsingStatements = false;
      } else if (line.startsWith('- show_when:')) {
        metadata.show_when = line.split(':', 2)[1].trim();
        isParsingOptions = false;
        isParsingLabels = false;
        isParsingStatements = false;
      } else if (line.startsWith('- maxLength:')) {
        metadata.maxLength = parseInt(line.split(':')[1].trim());
        isParsingOptions = false;
        isParsingLabels = false;
        isParsingStatements = false;
      } else if (line.startsWith('- scale:')) {
        metadata.scale = parseInt(line.split(':')[1].trim());
        isParsingOptions = false;
        isParsingLabels = false;
        isParsingStatements = false;
      } else if (line.startsWith('- options:')) {
        // Save any pending hierarchical option before switching context
        if (currentOption) {
          optionsList.push(currentOption);
          currentOption = null;
        }
        isParsingOptions = true;
        isParsingLabels = false;
        isParsingStatements = false;
      } else if (line.startsWith('- labels:')) {
        // Save any pending hierarchical option before switching context
        if (currentOption) {
          optionsList.push(currentOption);
          currentOption = null;
        }
        isParsingLabels = true;
        isParsingOptions = false;
        isParsingStatements = false;
      } else if (line.startsWith('- statements:')) {
        // Save any pending hierarchical option before switching context
        if (currentOption) {
          optionsList.push(currentOption);
          currentOption = null;
        }
        isParsingStatements = true;
        isParsingOptions = false;
        isParsingLabels = false;
      } else if (originalLine.startsWith('  - ') && isParsingOptions) {
        const content = line.replace(/^-\s*/, '').trim();

        // Check if this is a hierarchical option starting with "text:"
        if (content.startsWith('text:')) {
          // Save previous option if exists
          if (currentOption) {
            optionsList.push(currentOption);
          }
          // Start new hierarchical option
          currentOption = {
            text: content.replace('text:', '').trim()
          };
        } else if (content.includes(':') && !content.startsWith('text:')) {
          // This is a simple string that happens to contain a colon (backward compatible)
          if (currentOption) {
            optionsList.push(currentOption);
            currentOption = null;
          }
          optionsList.push(content);
        } else {
          // Simple string format (backward compatible)
          if (currentOption) {
            optionsList.push(currentOption);
            currentOption = null;
          }
          optionsList.push(content);
        }
      } else if (originalLine.startsWith('    description:') && isParsingOptions && currentOption) {
        // Add description to current hierarchical option
        currentOption.description = line.replace('description:', '').trim();
      } else if (originalLine.startsWith('  - ') && isParsingLabels) {
        labelsList.push(line.replace(/^-\s*/, '').trim());
      } else if (originalLine.startsWith('  - ') && isParsingStatements) {
        statementsList.push(line.replace(/^-\s*/, '').trim());
      }
    }

    // Save any pending hierarchical option at the end
    if (currentOption) {
      optionsList.push(currentOption);
    }

    if (optionsList.length > 0) {
      metadata.options = optionsList;
    }

    if (labelsList.length > 0) {
      metadata.labels = labelsList;
    }

    if (statementsList.length > 0) {
      metadata.statements = statementsList;
    }

    // Build question object
    const question = {
      id: metadata.id || `question_${index + 1}`,
      type: metadata.type || 'short_text',
      text: questionText,
      required: metadata.required !== undefined ? metadata.required : false,
    };

    // Add type-specific metadata
    if (metadata.placeholder) question.placeholder = metadata.placeholder;
    if (metadata.help) question.help = metadata.help;
    if (metadata.explanation) question.explanation = metadata.explanation;
    if (metadata.has_other !== undefined) question.has_other = metadata.has_other;
    if (metadata.maxLength) question.maxLength = metadata.maxLength;
    if (metadata.scale) question.scale = metadata.scale;
    if (metadata.options) question.options = metadata.options;
    if (metadata.labels) question.labels = metadata.labels;
    if (metadata.statements) question.statements = metadata.statements;
    if (metadata.depends_on) question.depends_on = metadata.depends_on;
    if (metadata.show_when) question.show_when = metadata.show_when;

    // Validation: warn if show_when without depends_on
    if (metadata.show_when && !metadata.depends_on) {
      logger.warn(`Question "${question.id}" has show_when but no depends_on`);
    }

    return question;
  } catch (error) {
    logger.error(`Error parsing question block ${index}`, { error: error.message });
    return null;
  }
}

/**
 * Get list of all available forms
 * @returns {Promise<Array>} Array of form IDs
 */
async function listForms() {
  try {
    const formsDir = path.join(__dirname, '..', '..', 'forms');
    const files = await fs.readdir(formsDir);

    // Filter to only .md files and remove extension
    const formIds = files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));

    return formIds;
  } catch (error) {
    logger.error('Error listing forms', { error: error.message, stack: error.stack });
    return [];
  }
}

module.exports = {
  parseForm,
  listForms,
};
