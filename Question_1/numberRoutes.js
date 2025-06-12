import express from 'express';
const app = express()
const port = 4000

    app.get("/test/primes", function (req, res) {
        res.json({ numbers: [2, 3, 5, 7, 11, 13, 17] });
    });

    app.get("/test/fibo", function (req, res) {
        res.json({ numbers: [0, 1, 1, 2, 3, 5, 8, 13] });
    });

    app.get("/test/even", function (req, res) {
        res.json({ numbers: [2, 4, 6, 8, 10, 12, 14] });
    });

    app.get("/test/rand", function (req, res) {
        var nums = [];
        for (var i = 0; i < 6; i++) {
            nums.push(Math.floor(Math.random() * 100));
        }
        res.json({ numbers: nums });
    });
  
app.listen(port, () => {
    console.log("port open on 4000");
    
})