import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModels from "../Models/UserModels.js";

export const register = async (req, resp) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const document = new UserModels({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
        });

        const user = await document.save();
        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret",
            {
                expiresIn: "30d",
            }
        );

        const { passwordHash, ...userData } = user._doc;

        resp.json({
            ...userData,
            token,
        });
    } catch (err) {
        consol.log(err);
        resp.status(500).json({
            success: false,
            message: "Не удалось зарегистрироваться",
        });
    }
};

export const login = async (req, resp) => {
    try {
        const user = await UserModels.findOne({ email: req.body.email });

        if (!user) {
            return resp.status(404).json({
                success: false,
                message: "Неверный логин или пароль",
            });
        }

        const invalidPassword = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );

        if (!invalidPassword) {
            return resp.status(404).json({
                success: false,
                message: "Неверный логин или пароль",
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret",
            {
                expiresIn: "30d",
            }
        );

        const { passwordHash, ...userData } = user._doc;

        resp.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        req.status(500).json({
            success: false,
            message: "Не удалось авторизоваться",
        });
    }
};

export const getInfoMe = async (req, resp) => {
    try {
        const user = await UserModels.findById(req.userId);

        if (!user) {
            return resp.status(404).json({
                message: "Пользователь не найден",
            });
        }

        const { passwordHash, ...userData } = user._doc;

        resp.json({ ...userData });
    } catch (err) {
        console.log(err);
        resp.status(500).json({
            message: "Нет доступа",
        });
    }
};
