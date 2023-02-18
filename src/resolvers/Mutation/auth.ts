import { Context } from '../../index'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'
import { JSON_SIGNATURE } from '../../keys'

interface SignupArgs {
    email: string
    name: string
    password: string
    bio: string
}

interface SigninArgs {
    email: string
    password: string
}

interface UserPayload {
    userErrors: {
        message: string
    }[]
    token: string | null
}

export const authResolvers = {
    signup: async (_: any, { email, name, password, bio }: SignupArgs, {  prisma }: Context): Promise<UserPayload> => {

        const isEmail = validator.isEmail(email)

        if(!isEmail){
            return {
                userErrors: [{
                    message: 'Please provide a valid email'
                }],
                token: null
            }
        }

        if(!validator.isLength(password, {min: 5})){
            return {
                userErrors: [{
                    message: 'Password too short'
                }],
                token: null
            }
        }

        if(!name || !bio){
            return {
                userErrors: [{
                    message: 'Please provide name name bio'
                }],
                token: null
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            }
        })

        await prisma.profile.create({
            data: {
                userId: user.id,
                bio
            }
        })

        const token = await JWT.sign(
            {
                userId: user.id
            }, JSON_SIGNATURE, 
            {
                expiresIn: 3600000
            }
            )

        return {
            userErrors: [],
            token
        }
    },

    signin: async (_: any, { email, password }: SigninArgs, {  prisma }: Context): Promise<UserPayload> => {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })


        if(!user) {
            return {
                userErrors: [
                    {
                        message: "User doesn't exist",
                    }
                ],
                token: null
            }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid){
            return {
                userErrors: [
                    {
                        message: "Incorrect password",
                    }
                ],
                token: null
            }
        }

        return {
            userErrors: [],
            token: JWT.sign({userId: user.id}, JSON_SIGNATURE, {
                expiresIn: 3600000
            })
        }
    }
}