import express from "express";

import { Post } from "../entities/post";
import { User } from "../entities/user";
import { Tag } from "../entities/tag";
const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await Post.find({
    relations: {
      author: true,
      comments: true,
      tags: true,
    },
  });
  return res.json(posts);

  //   // if (!post){
  //   return res.json({ msg: "post not found" })
  //   //
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
        if (tag) 
        tagsSave.push(tag);
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

router.delete("/", async (req, res) => {});

export { router as postRouter };
