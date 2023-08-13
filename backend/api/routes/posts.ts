import express from "express";
import {
  addPost,
  deletePost,
  getPost,
  getAllPosts,
  updatePost,
} from "../controllers/postController";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPost);
router.post("/", addPost);
router.post("/delete/:id", deletePost);
router.put("/:id", updatePost);

export default router;