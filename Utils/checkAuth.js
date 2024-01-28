import jwt from "jsonwebtoken";

//Middleware
export default (req, resp, next) => {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

    if (token) {
        try {
            const decoded = jwt.verify(token, "secret");

            req.userId = decoded._id;
            next();
        } catch (e) {
            return resp.status(403).json({
                success: false,
                message: "Нет доступа",
            });
        }
    } else {
        return resp.status(403).json({
            success: false,
            message: "Нет доступа",
        });
    }
};
