import { Context } from '../../index'
import validator from 'validator'
import bcrypt from 'bcryptjs'

interface SignupArgs {
    email: string
    name: string
    password: string
    bio: string
}

interface UserPayload {
    userErrors: {
        message: string
    }[]
    user: null
}

export const authResolvers = {
    signup: async (_: any, { email, name, password, bio }: SignupArgs, {  prisma }: Context): Promise<UserPayload> => {

        const isEmail = validator.isEmail(email)

        if(!isEmail){
            return {
                userErrors: [{
                    message: 'Please provide a valid email'
                }],
                user: null
            }
        }

        if(!validator.isLength(password, {min: 5})){
            return {
                userErrors: [{
                    message: 'Password too short'
                }],
                user: null
            }
        }

        if(!name || !bio){
            return {
                userErrors: [{
                    message: 'Please provide name name bio'
                }],
                user: null
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        })

        return {
            userErrors: [],
            user: null
        }
    }
}