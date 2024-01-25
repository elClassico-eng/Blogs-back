import express from "express";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());

app.get("/", (req, resp) => {
    resp.send("Hello our World");
});

app.post("/auth/login", (req, resp) => {
    console.log(req.body);

    const token = jwt.sign(
        {
            email: req.body.email,
            fullName: "yanedlb",
        },
        "4erkesovvn"
    );

    resp.json({
        success: true,
        token,
    });
});

app.listen(4444, (err) => {
    err ? console.log(err) : console.log("Server OK");
});
