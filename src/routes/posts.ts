import express from "express";

import { Post } from "../entities/post";
import { User } from "../entities/user";
import { Tag } from "../entities/tag";
import { Likes } from "../entities/likes";
const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await Post.find({
    relations: {
      author: true,
      comments: true,
      tags: true,
      likes:true,
    },
  });
  return res.json(posts);

  //   // if (!post){
  //   return res.json({ msg: "post not found" })
  //   //
});

router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({
    where: { id: +postId },
    relations: {
      author: true,
      comments: true,
      tags: true,
      likes:true,
    },
  });

  return res.send(post);
});

router.post("/:authorId", async (req, res) => {
  const { authorId } = req.params;
  const author = await User.findOne({
    where: { id: +authorId },
  });
  if (!author) {
    res.json({ msg: "user doesn't exist" });
  }
  const { title, body, tags } = req.body;

  const tagsSave: Tag[] = [];

  for (let i = 0; i < tags.length; i++) {
    const tag = await Tag.findOneBy({ id: tags[i].id });
    if (tag) tagsSave.push(tag);
  }

  const post = Post.create({
    title: title,
    body: body,
    author,
    tags: tagsSave,
  });

  await post.save();
  return res.json(post);
});

router.put("/update/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({
    where: { id: +postId },
  });
  Post.merge(post, req.body);
  const results = await Post.save(post);
  return res.send(results);
});

router.delete("/", async (req, res) => { });





router.post("/like/:authorId/:postId", async function (req, res) {

  const { authorId } = req.params;
  const { postId } = req.params;
  const { value } = req.body;

  const user = await User.findOneBy({ id: +authorId });
  const post = await Post.findOneBy({ id: +postId });
  const userLike = await Likes.findOneBy({
    user: { id: +authorId },
    post: { id: +postId },
  });
  console.log(userLike);
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  if (!post) {
    return res.status(404).json({ msg: "Post not found" });
  }

  if (userLike) {
    const updatedLike = await Likes.update(userLike.id, {
      value: value,
    });
 
    return res.status(200).json(updatedLike);
  }
  const newLike = Likes.create({
    user,
    post,
    value,
  });

  await newLike.save();

  return res.json(newLike);
});

export { router as postRouter };
