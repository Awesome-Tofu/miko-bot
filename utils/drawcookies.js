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
        "value": "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzZWEtYXJ0IiwiYXVkIjpbImxvZ2luIl0sImV4cCI6MTcwNjU5OTIzOCwiaWF0IjoxNzA1OTk0NDM4LCJqdGkiOiIyODk4Njk4NDU5MjU5MTg3NyIsInBheWxvYWQiOnsiaWQiOiI1N2ExMmI2MTEwNmI0MzQ2NmYxZWExMjM1ZjA0NTVjMCIsImVtYWlsIjoidGZmZmdmeDg3QGdtYWlsLmNvbSIsImNyZWF0ZV9hdCI6MTcwNDczNTE0MDU3MSwic3RhdHVzIjoxfX0.Xj1TsEuphOA7-wWXBD5HJFcq6lGGprGPRnUXQSDTNh0JjXhw9xoYcuMCbJRYSK5K35iPO6_1dEL4ltf5IN72g6KDpZKFHG_pnpv-OWdCXR5XJL2Qx_khPKkOQTgQa2vnuUYxLO_L7STeaWQx_aXuQ8n4eFOfLPE2Tl48jNqEKNalJB6pNWRp1KzNGaQfA8yxhFYEqtlOvFLRsHUkItsvK1z-6BnuVmqT494E-RuOfUrVNhVivxPUccD7OTPXMlxhtolyG6oxQjmsp7nuRBos_-uWlYzw6eahOcKbUJTFeHqWSvs5LJ-DDZ5VPfrDnwUuC3ldDYErf6TqIPO_JS4R-A"
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