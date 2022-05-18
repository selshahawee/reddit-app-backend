import { Entity, PrimaryGeneratedColumn, Column ,BaseEntity,OneToMany } from "typeorm"
import { Post } from './post'
import { Comment } from './comment'
import { Likes } from "./likes";
@Entity("user")
    
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @OneToMany(
        () => Post,
        post=> post.author
    )
    posts: Post[]
        
    @Column()
    lastName: string

    @Column({nullable: true})
    imgUrl: string

    @OneToMany(
        () => Comment,
        post=> post.author
    )
    comments: Comment[]
    
    @OneToMany(() => Likes, (likes) => likes.user)
    likes: Likes[];
}

