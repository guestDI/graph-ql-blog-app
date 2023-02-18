import { ApolloServer, } from 'apollo-server'
import { typeDefs } from './schema'
import { Query, Mutation } from './resolvers'
import { PrismaClient, Prisma } from '@prisma/client'
import { getUserIdFromToken } from './utils/getUserFromToken'

export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
    userInfo: {
        userId: number 
    } | null
}

const prisma = new PrismaClient()

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation
    },
    context: async ({ req }: any): Promise<Context> => {
        const userInfo = await getUserIdFromToken(req.headers.authorization)

        return {
            prisma,
            userInfo
        }
    }
})

server.listen().then(({ url }) => {
    console.log(`Server ready on ${url}`)
})