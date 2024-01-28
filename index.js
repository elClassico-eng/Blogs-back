import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import * as Valid from "./Validations/validations.js";
import * as UserController from "./Controllers/UserController.js";
import * as PostController from "./Controllers/PostController.js";

import checkAuth from "./Utils/checkAuth.js";
import handleValidationErrors from "./Utils/handleValidationErrors.js";

mongoose
    .connect(
        "mongodb+srv://yanedlb:0HIz7g3ykGVYrFOZ@admin.ttbmlbd.mongodb.net/blog?retryWrites=true&w=majority"
    )
    .then(() => console.log("DB OK"))
    .catch((err) => console.log(`DB error, ${err}`));

const app = express();

const storage = multer.diskStorage({
    destination: (_, file, cb) => {
        cb(null, "uploads");
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/upload", express.static("uploads"));

app.post(
    "/auth/login",
    Valid.loginValidation,
    handleValidationErrors,
    UserController.login
);
app.post(
    "/auth/register",
    Valid.registerValidation,
    handleValidationErrors,
    UserController.register
);
app.get("/auth/me", checkAuth, UserController.getInfoMe);

app.post("/upload", checkAuth, upload.single("image"), (req, resp) => {
    resp.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get("/posts/:id", PostController.getOne);
app.get("/posts", PostController.getAll);
app.post(
    "/posts",
    checkAuth,
    Valid.postCreateValidations,
    handleValidationErrors,
    PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
    "/posts/:id",
    checkAuth,
    Valid.postCreateValidations,
    handleValidationErrors,
    PostController.update
);

app.listen(4444, (err) => {
    err ? console.log(err) : console.log("Server OK");
});
