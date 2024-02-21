let cookies = [
    {
        "domain": "www.seaart.ai",
        "expirationDate": 1705996300,
        "hostOnly": true,
        "httpOnly": false,
        "name": "pdfcc",
        "path": "/",
        "sameSite": null,
        "secure": false,
        "session": false,
        "storeId": null,
        "value": "2"
    },
    {
        "domain": "www.seaart.ai",
        "expirationDate": 1706599300.594619,
        "hostOnly": true,
        "httpOnly": false,
        "name": "lang",
        "path": "/",
        "sameSite": "lax",
        "secure": false,
        "session": false,
        "storeId": null,
        "value": "en"
    },
    {
        "domain": "www.seaart.ai",
        "expirationDate": 1706599209.681733,
        "hostOnly": true,
        "httpOnly": false,
        "name": "T",
        "path": "/",
        "sameSite": null,
        "secure": false,
        "session": false,
        "storeId": null,
        "value": "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzZWEtYXJ0IiwiYXVkIjpbImxvZ2luIl0sImV4cCI6MTcwOTE0MzM1OSwiaWF0IjoxNzA4NTM4NTU5LCJqdGkiOiIzMTY1NDY4OTAwMDk3NTM2NSIsInBheWxvYWQiOnsiaWQiOiI1N2ExMmI2MTEwNmI0MzQ2NmYxZWExMjM1ZjA0NTVjMCIsImVtYWlsIjoidGZmZmdmeDg3QGdtYWlsLmNvbSIsImNyZWF0ZV9hdCI6MTcwNDczNTE0MDU3MSwic3RhdHVzIjoxfX0.eVKJkXs75BvMQxvNeyqxLNYBpuAemQUkj9cWCOaCaEnow8I4U0S81jH3yHKjkKrNVy3yNRpriWIhabdmBIDVDu4_KspkLybnNi_y5dmV-3_Y0Yiot69KqTYsnReDgJOAsfK6xEmC-NZ0eJYT5g-TCWwOhMe__7FDg3X99Lb0mAi3fAq95Nf9DR9E3eH7eP4SWcP6AyZVB42B4qiUAANtlnOm9z5Fu4qK92-pVDUDg9byS1elZYb1MzdfIEfBFtKmcZW9daMtB4_NhKm7AOpK_Crxs_m7RjRmb8wD8KFWsHVX0a2bRCgvqLKxYDRvGaCiMwKnaBGTD-1467cyI5vpFg"
    }
]
// Check the sameSite attribute of each cookie
cookies = cookies.map(cookie => {
    if (cookie.sameSite && ['Strict', 'Lax', 'None'].includes(cookie.sameSite)) {
        return cookie;
    } else {
        // If sameSite is not a valid string, set it to 'None'
        return { ...cookie, sameSite: 'None' };
    }
});


module.exports = cookies;
