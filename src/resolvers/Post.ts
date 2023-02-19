import { Context } from ".."
import { userLoader } from "../loaders/userLoaders"

export const Post = {
    user: (parent: any) => {
        userLoader.load(parent.authorId)
    }
}