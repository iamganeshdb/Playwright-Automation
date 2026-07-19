// const {base} = require('@playwright/test');

// exports.customtest = base.extend({
//     testdatafororder: {
//         userName: "anshika@gmail.com",
//         cardNumber: "4542 9931 9292 2293",
//         cvv: "123",
//         country: "India",
//         passWord: "Iamking@000",
//         productName: "ZARA COAT 3"
//     }
// });

const { test: base } = require('@playwright/test');

exports.customtest = base.extend({
    testdatafororder: async ({}, use) => {
        const data = {
            userName: "anshika@gmail.com",
            cardNumber: "4542 9931 9292 2293",
            cvv: "123",
            country: "India",
            passWord: "Iamking@000",
            productName: "ZARA COAT 3"
        };

        await use(data);
    }
});