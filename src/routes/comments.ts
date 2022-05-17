import express from 'express'
import {Request, Response} from 'express'
import Router from 'express'
import { User } from '../entities/user';
import { Comment } from '../entities/comment';
import{Post} from '../entities/post'

const router = express.Router();


router.get('/', async (req, res) => {
    const comments = await Comment.find({
        relations: {
          author: true,
          post: true,
          },
          
      });
      return res.json(comments);
})

router.post('/:authorId/:postId', async (req, res) => {
    const { authorId,postId } = req.params;
    const author = await User.findOneBy({ id: parseInt(authorId) });
    const post = await Post.findOne({
        where: { id: +postId },
        relations: {
          author: true,
          tags: true,
        },
      })
    
    const {
     body,
    } = req.body;
    const comment = Comment.create({
        body: body,
    });
    await comment.save()
    return res.json (comment)
    
    })


    router.delete('/', async (req, res) => {
    })


export {
    router as commentsRouter}
