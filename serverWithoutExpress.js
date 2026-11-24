/* This file create the server without Express, parse the URL,
 read the body stream, return JSON with the right Content-Type and status 
*/

const http = require("http");
const fs = require("fs");
const url = require("url");

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data));
}

function myHandler(req, res) {

    if (req.url === "/favicon.ico") {
        res.writeHead(204);
        return res.end();
    }

    const log = `${Date.now()} : ${req.method} ${req.url} New Request Received\n`;

    fs.appendFile("log.txt", log, (err) => {
        if (err) console.error("Logging Error:", err);
    });

    const myUrl = url.parse(req.url, true);
    
    switch (myUrl.pathname) {

        case "/":
            if (req.method === "GET") {
                return sendJSON(res, 200, {
                    message: "HomePage"
                });
            }
            break;

        case "/about":
            if (req.method === "GET") {
                const userName = myUrl.query.myName;

                return sendJSON(res, 200, {
                    message: `Hi, ${userName}`
                });
            }
            break;

        case "/search":
            if (req.method === "GET") {
                const searchQuery = myUrl.query.search_query;

                return sendJSON(res, 200, {
                    message: `Here is the result for search - ${searchQuery}`
                });
            }
            break;

        case "/signup":

            if (req.method === "GET") {
                return sendJSON(res, 200, {
                    message: "This is a Signup Form"
                });
            }

            else if (req.method === "POST") {

                let body = "";

                // Read incoming data stream
                req.on("data", (chunk) => {
                    body += chunk.toString();
                });

                // Execute after receiving the complete body
                req.on("end", () => {

                    try {
                        const parsedData = JSON.parse(body);

                        return sendJSON(res, 201, {
                            message: "Signup Successful",
                            data: parsedData
                        });

                    } catch (err) {
                        return sendJSON(res, 400, {
                            error: "Invalid Data"
                        });
                    }

                });
                return;
            }
            break;

        default:
            return sendJSON(res, 404, {
                error: "404 Not Found"
            });
    }

    return sendJSON(res, 405, {
        error: "Method Not Allowed"
    });
}

const myserver = http.createServer(myHandler);

myserver.listen(8000, () => {
    console.log("Server Started at 8000");
});





/* Simple Server creation 

const http = require("http");

const myServer = http.createServer((req, res) => {
    console.log("New Req Rec.")
    res.end("Hello From Server")
});

myServer.listen(8000, () => console.log("Server Started") )

*/

