import { body } from "express-validator";

export const loginValidation = [
    body("email", "Неверный формат почты").isEmail(),
    body("password", "Пароль должен содержать минимум 5 символом").isLength({
        min: 5,
    }),
];
export const registerValidation = [
    body("email", "Неверный формат почты").isEmail(),
    body("password", "Пароль должен содержать минимум 5 символом").isLength({
        min: 5,
    }),
    body("fullName", "Введите свое имя").isLength({ min: 3 }),
    body("avatarUrl", "Неверная ссылка на аватар").optional().isURL(),
];
export const postCreateValidations = [
    body("title", "Введите заголовок статьи").isLength({ min: 5 }).isString(),
    body("text", "Введите текст статьи").isLength({ min: 3 }).isString(),
    body("tags", "Неверный формат тегов(укажите массив)").optional().isString(),
    body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];
