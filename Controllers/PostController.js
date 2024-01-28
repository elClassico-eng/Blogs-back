import PostModels from "../Models/PostModels.js";

export const getAll = async (req, resp) => {
    try {
        const posts = await PostModels.find().populate("user").exec();

        resp.json(posts);
    } catch (e) {
        console.log(e);
        resp.status(500).json({
            message: "Не удалось получить статьи",
        });
    }
};

export const getOne = async (req, resp) => {
    try {
        const postId = req.params.id;

        const updatedDoc = await PostModels.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                new: true,
            }
        ).exec();

        if (!updatedDoc) {
            return resp.status(404).json({
                message: "Статья не найдена",
            });
        }

        resp.json(updatedDoc);
    } catch (e) {
        console.log(e);
        return resp.status(500).json({
            message: "Не удалось вернуть статью",
        });
    }
};

export const remove = async (req, resp) => {
    try {
        const postId = req.params.id;
        const updateDoc = await PostModels.findOneAndDelete({ _id: postId });

        if (!updateDoc) {
            return resp.json({
                message: "Не удалось удалить статью",
            });
        }

        resp.json({
            success: true,
        });
    } catch (e) {
        console.log(e);
        return resp.status(500).json({
            message: "Не удалось вернуть статью",
        });
    }
};

export const create = async (req, resp) => {
    try {
        const doc = new PostModels({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });

        const post = await doc.save();

        resp.json(post);
    } catch (err) {
        console.log(err);
        resp.status(500).json({
            message: "Не удалось создать статью",
        });
    }
};

export const update = async (req, resp) => {
    try {
        const postId = req.params.id;

        await PostModels.updateOne(
            { _id: postId },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                user: req.userId,
            }
        );

        resp.json({
            success: true,
        });
    } catch (e) {
        console.log(e);
        resp.status(500).json({
            message: "Не удалось обновить статью",
        });
    }
    const postId = req.params.id;
};
