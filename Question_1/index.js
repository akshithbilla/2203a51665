import express from 'express';
import axios from "axios";
const app = express()
const PORT = 3000;
var windowSize = 10;
var fetchTimeout = 500;

var fetchUrls = {
    p: "http://localhost:4000/test/primes",
    f: "http://localhost:4000/test/fibo",
    e: "http://localhost:4000/test/even",
    r: "http://localhost:4000/test/rand"
};

var windowState = [];

function getAverage(arr) {
    if (arr.length === 0) return 0;
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return parseFloat((sum / arr.length).toFixed(2));
}


// Average Calculator API
app.get("/numbers/:numberid", function (req, res) {
    var numberid = req.params.numberid;

    if (!fetchUrls[numberid]) {
        return res.status(400).json({ error: "Invalid number ID. Use p, f, e, or r." });
    }

    var url = fetchUrls[numberid];
    var start = Date.now();
    var fetchedNumbers = [];

    axios
        .get(url, { timeout: fetchTimeout })
        .then(function (response) {
            if (response.data && Array.isArray(response.data.numbers)) {
                fetchedNumbers = response.data.numbers;
            }
        })
        .catch(function (err) {
            console.error("Error fetching:", err.message);
        })
        .finally(function () {
            var windowPrevState = windowState.slice();

            for (var i = 0; i < fetchedNumbers.length; i++) {
                var num = fetchedNumbers[i];
                if (windowState.indexOf(num) === -1) {
                    if (windowState.length >= windowSize) {
                        windowState.shift();
                    }
                    windowState.push(num);
                }
            }

            var windowCurrState = windowState.slice();
            var avg = getAverage(windowState);
            var elapsed = Date.now() - start;

            var delay = Math.max(0, fetchTimeout - elapsed);
            setTimeout(function () {
                res.json({
                    windowPrevState: windowPrevState,
                    windowCurrState: windowCurrState,
                    numbers: fetchedNumbers,
                    avg: avg
                });
            }, delay);
        });
});

app.listen(PORT, function () {
    console.log("Server running at http://localhost:" + PORT);
});