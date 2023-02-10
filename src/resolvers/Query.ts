import { Context } from '../index'

export const Query = {
    posts: async (parent: any, args: any, {  prisma }: Context) => {
        return await prisma.post.findMany({
            orderBy: [
                {
                    createdAt: "desc"
                }
            ]
        })
    }
}