const Exceljs=require('exceljs');
const {test,expect} = require('@playwright/test');

async function WriteexcelTest(searchText,replaceText,change,filePath){
const workbook = new Exceljs.Workbook();
await workbook.xlsx.readFile(filePath);
const worksheet=workbook.getWorksheet('Sheet1');

 const output = await readExcel(worksheet,searchText);
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

test("UploadDownload",async({page})=>
{
    
    const searchText="Kivi";
    const replaceText="100";
    const FilePath="/Users/ganesh/downloads/download.xlsx";
 await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
 const downloadpromise=page.waitForEvent("download");
 await page.getByText('Download').click();
 await downloadpromise;
 await WriteexcelTest(searchText,replaceText,{rowChange:0,columnChange:2}, FilePath);
//await page.locator('#fileinput').click();
await page.locator('#fileinput').setInputFiles(FilePath);
//await page.locator('#fileinput').uploadFile(FilePath);
//const text=await page.getByText(searchText);
const desiredRow=await page.getByRole('row').filter({hasText:searchText});
await expect( desiredRow.locator("#cell-4-undefined")).toContainText(replaceText);
await page.pause();
})