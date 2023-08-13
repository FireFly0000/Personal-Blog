"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const router = express_1.default.Router();
router.get("/", postController_1.getAllPosts);
router.get("/:id", postController_1.getPost);
router.post("/", postController_1.addPost);
router.post("/delete/:id", postController_1.deletePost);
router.put("/:id", postController_1.updatePost);
exports.default = router;
//# sourceMappingURL=posts.js.map