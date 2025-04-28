// utils/catalogParser.js

import xml2js from 'xml2js';
import fs from 'fs/promises'; // Node.js promises-based FS module

// Function to parse a catalog file (XML format)
export async function parseCatalog(filePath) {
  try {
    const xmlContent = await fs.readFile(filePath, 'utf-8');
    const parsed = await xml2js.parseStringPromise(xmlContent, { explicitArray: false });

    // Safely navigate to the product list
    let items = parsed?.PIES?.Items?.Item || [];

    // Always return an array
    if (!Array.isArray(items)) {
      items = [items];
    }

    return items;
  } catch (error) {
    console.error('Error parsing catalog file:', error);
    throw new Error('Failed to parse catalog file');
  }
}
