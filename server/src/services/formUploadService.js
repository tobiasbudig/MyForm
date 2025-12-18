const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

const FORMS_DIR = path.join(__dirname, '../../forms');

function sanitizeFilename(filename) {
  const nameWithoutExt = path.basename(filename, '.md');

  const sanitized = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);

  if (!sanitized) {
    throw new Error('Invalid filename');
  }

  return `${sanitized}.md`;
}

function validateMarkdownContent(content) {
  try {
    const { data: frontmatter } = matter(content);

    if (!frontmatter.title) {
      throw new Error('Frontmatter must include a title field');
    }

    return true;
  } catch (error) {
    throw new Error(`Invalid markdown format: ${error.message}`);
  }
}

async function saveFormFile(file) {
  const fileContent = file.buffer.toString('utf-8');

  validateMarkdownContent(fileContent);

  const sanitizedFilename = sanitizeFilename(file.originalname);
  const formId = path.basename(sanitizedFilename, '.md');
  const filePath = path.join(FORMS_DIR, sanitizedFilename);

  const resolvedPath = path.resolve(filePath);
  const resolvedFormsDir = path.resolve(FORMS_DIR);

  if (!resolvedPath.startsWith(resolvedFormsDir)) {
    throw new Error('Invalid file path');
  }

  let fileExists = false;
  try {
    await fs.access(filePath);
    fileExists = true;
  } catch (error) {
    // File doesn't exist, which is fine
  }

  await fs.writeFile(filePath, fileContent, 'utf-8');

  // Set permissions to allow both container and host user to read/write
  // Ignore permission errors if we don't own the file (it may already have correct permissions)
  try {
    await fs.chmod(filePath, 0o666);
  } catch (error) {
    if (error.code !== 'EPERM') {
      throw error;
    }
    // EPERM is expected when we don't own the file - that's okay
  }

  return {
    formId,
    filename: sanitizedFilename,
    replaced: fileExists,
  };
}

module.exports = {
  saveFormFile,
};
