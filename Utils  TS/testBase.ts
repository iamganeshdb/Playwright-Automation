import { test as baseTest,expect,Page ,Locator} from "@playwright/test";
interface testdatafororder
{
  userName: string;
  cardNumber: string;
  cvv: string;
  country: string;
  passWord: string;
  productName: string;
};
exports.customtest = baseTest.extend<{testdatafororder:testdatafororder}>
{testdatafororder: {

      userName: "anshika@gmail.com",
      cardNumber: "4542 9931 9292 2293",
      cvv: "123",
      country: "India",
      passWord: "Iamking@000",
      productName: "ZARA COAT 3",
    }};
