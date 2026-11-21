// Downloads a workbook, edits the Kivi row, uploads it, and checks the updated cell value.
import { expect, test } from '@playwright/test';
import ExcelJS, { type Worksheet } from 'exceljs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

interface CellPosition {
  row: number;
  column: number;
}

async function findCell(worksheet: Worksheet, searchText: string): Promise<CellPosition | undefined> {
  let position: CellPosition | undefined;
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, columnNumber) => {
      if (cell.value === searchText) {
        position = { row: rowNumber, column: columnNumber };
      }
    });
  });
  return position;
}

async function editWorkbook(filePath: string, searchText: string, replacement: string): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet('Sheet1');
  if (!worksheet) {
    throw new Error('The downloaded workbook does not contain Sheet1.');
  }

  const position = await findCell(worksheet, searchText);
  if (!position) {
    throw new Error(`Could not find "${searchText}" in the workbook.`);
  }
  worksheet.getCell(position.row, position.column + 2).value = replacement;
  await workbook.xlsx.writeFile(filePath);
}

test('downloads, edits, and uploads an Excel file', async ({ page }) => {
  const searchText = 'Kivi';
  const replacement = '100';
  const filePath = process.env.EXCEL_TEST_FILE ?? join(tmpdir(), 'playwright-download.xlsx');

  await page.goto('https://rahulshettyacademy.com/upload-download-test/index.html');
  const downloadPromise = page.waitForEvent('download');
  await page.getByText('Download').click();
  const download = await downloadPromise;
  await download.saveAs(filePath);
  await editWorkbook(filePath, searchText, replacement);

  await page.locator('#fileinput').setInputFiles(filePath);
  const matchingRow = page.getByRole('row').filter({ hasText: searchText });
  await expect(matchingRow.locator('#cell-4-undefined')).toContainText(replacement);
});
