// Downloads a workbook, edits the Kivi row, uploads it, and checks the updated cell value.
const Exceljs=require('exceljs');
const {test,expect} = require('@playwright/test');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

async function WriteexcelTest(searchText,replaceText,change,filePath){
const workbook = new Exceljs.Workbook();
await workbook.xlsx.readFile(filePath);
const worksheet=workbook.getWorksheet('Sheet1');
if (!worksheet) {
    throw new Error('The downloaded workbook does not contain Sheet1.');
}

 const output = await readExcel(worksheet,searchText);
if (output.row < 1 || output.column < 1) {
    throw new Error(`Could not find "${searchText}" in the workbook.`);
}
const cell=worksheet.getCell(output.row,output.column+change.columnChange);
cell.value=replaceText;
await workbook.xlsx.writeFile(filePath);

}

async function readExcel(worksheet,searchText)
{
     let output={row:-1,column:-1};
    worksheet.eachRow((row,rownumber)=>
{
    row.eachCell((cell,columnnumber)=>
    {
        if(cell.value===searchText)
        {
            output.row=rownumber;
            output.column=columnnumber;
        }
    })
})
return output;
}

test("downloads, edits, and uploads an Excel file",async({page})=>
{
    
    const searchText="Kivi";
    const replaceText="100";
    const FilePath=process.env.EXCEL_TEST_FILE ?? join(tmpdir(), 'playwright-download.xlsx');
 await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
 const downloadpromise=page.waitForEvent("download");
 await page.getByText('Download').click();
 const download = await downloadpromise;
 await download.saveAs(FilePath);
 await WriteexcelTest(searchText,replaceText,{rowChange:0,columnChange:2}, FilePath);
await page.locator('#fileinput').setInputFiles(FilePath);
const desiredRow=await page.getByRole('row').filter({hasText:searchText});
await expect( desiredRow.locator("#cell-4-undefined")).toContainText(replaceText);
})