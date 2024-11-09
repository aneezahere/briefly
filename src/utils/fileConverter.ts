import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { PDFDocument } from 'pdf-lib';
import { getDocument } from 'pdfjs-dist';

export async function fileToText(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'txt':
    case 'md':
    case 'rtf':
      return await file.text();
      
    case 'pdf':
      return await handlePDF(file);
      
    case 'doc':
    case 'docx':
      return await handleWord(file);
      
    case 'xls':
    case 'xlsx':
      return await handleExcel(file);
      
    case 'ppt':
    case 'pptx':
      return await handlePowerPoint(file);
      
    default:
      throw new Error('Unsupported file type');
  }
}

async function handlePDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument(arrayBuffer).promise;
  let text = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(' ') + '\n';
  }
  
  return text;
}

async function handleWord(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function handleExcel(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  let text = '';
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    text += `Sheet: ${sheetName}\n`;
    text += XLSX.utils.sheet_to_csv(worksheet) + '\n\n';
  });
  
  return text;
}

async function handlePowerPoint(file: File): Promise<string> {
  // PowerPoint handling is more complex and might require a server-side solution
  // For now, we'll throw an error
  throw new Error('PowerPoint files are not supported in the browser. Please convert to PDF first.');
} 