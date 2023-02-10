import { Post } from '@prisma/client'
import { Context } from '../index'

interface PostArgs {
    post: {
        title: string
        content: string
    }
}

type PostUpdateArgs = PostArgs & { postId: string } 

interface PostPayloadType {
    userErrors: {
        message: string
    }[],
    post: Post | null
}

export const Mutation = {
    postCreate: async (_: any, { post: {title, content} }: PostArgs, {  prisma }: Context): Promise<PostPayloadType> => {
        if(!title || !content) {
            return {
                userErrors: [{
                    message: 'Please provide title and content to create a post'
                }],
                post: null
            }
        } 

        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: 1
            }
        })

        return {
            userErrors: [],
            post
        }

    },
    postUpdate: async (_: any, { postId, post: {title, content} }: PostUpdateArgs, {  prisma }: Context): Promise<PostPayloadType> => {
        if(!title && !content) {
            return {
                userErrors: [{
                    message: 'Please provide title or content to update a post'
                }],
                post: null
            }
        } 

        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if(!existingPost) {
            return {
                userErrors: [{
                    message: "Post doesn't exist"
                }],
                post: null
            }
        }

        const updatedPost = await prisma.post.update({
            data: {
                title: title ?? existingPost.title,
                content: content ?? existingPost.content,
            },
            where: {
                id: Number(postId)
            }
        })

        return {
            userErrors: [],
            post: updatedPost
        }

    },
    postDelete: async (_: any, { postId }: { postId: string }, {  prisma }: Context): Promise<PostPayloadType> => {
        if(!postId) {
            return {
                userErrors: [{
                    message: 'Please provide postID to delete a post'
                }],
                post: null
            }
        } 

        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if(!existingPost) {
            return {
                userErrors: [{
                    message: "Post doesn't exist"
                }],
                post: null
            }
        }

        const deletedPost = await prisma.post.delete({
            where: {
                id: Number(postId)
            }
        })

        return {
            userErrors: [],
            post: deletedPost
        }

    }
}