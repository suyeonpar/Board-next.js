import nextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import db from '@/db';
import { RowDataPacket } from "mysql2";
import { JWT } from 'next-auth/jwt';
import { Session } from "next-auth";

interface User {
    id: string;
    name: string;
    email: string;
    level: number;
}

interface CustomSession extends Session {
    user?: User
}

export const authOptions : any = {
    providers : [
        GithubProvider({
            clientId : `${process.env.GITHUB_ID}`,
            clientSecret : `${process.env.GITHUB_PW}`
        }),
        KakaoProvider({
            clientId: `${process.env.KAKAO_ID}`,
            clientSecret: `${process.env.KAKAO_PW}`
        }),
        NaverProvider({
            clientId: `${process.env.NAVER_ID}`,
            clientSecret: `${process.env.NAVER_PW}`
        }),
        GoogleProvider({
            clientId: `${process.env.GOOGLE_ID}`,
            clientSecret: `${process.env.GOOGLE_PW}`
        }),
        // 로그인기능 지원
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "email", type: "text"},
                password: {label: "password", type: "password"}
            },
            // 로그인 요청시 실행되는 코드 디비와 비교 이후 맞으면 return user 정보를 보내고 틀리면 return null
            async authorize(credentials) : Promise< User | null >{

                try{
                    const [results] = await db.query<RowDataPacket[]>('select * from board.member where email = ?', [credentials?.email]);
                    console.log(results)
                    const userResult = results[0]
                    if(!credentials || !credentials.email || !credentials.password){
                        return null;
                    }
                    if(!userResult.email || !userResult.password){
                        console.log("해당 사용자가 없습니다.");
                        return null
                    }
                    const pwCheck = await bcrypt.compare(credentials.password, userResult?.password); // 비밀번호 비교 맞으면 true 틀리면 false
                    console.log(pwCheck)
                    if(!pwCheck){
                        console.log("비밀번호 에러")
                        return null // 로그인상태가 아닌걸 반환
                    }
                    const user: User = {
                        id: userResult.id,
                        name: userResult.name,
                        email: userResult.email,
                        level: userResult.level
                    }
                    return user;
                }catch(error){
                    return null;
                }

            }
        })
    ],
    // pages: {
    //     signinIn: '/login' // admin 로그인페이지 만들 수 있음
    // },
    // jwt 만료일 설정 마지막 30은 month
    session  :{
        strategy : "jwt",
        maxAge: 24 * 60 * 60 * 30
    },
    // jwt 만들 때 실행되는 코드 토큰 발급
    callbacks: {
        jwt: async ({ token, user } : {token: JWT, user?: User}) =>{
            if(user){
                token.user = {
                    name : user.name,
                    email : user.email,
                    level : user.level
                };
            }
            return token
        },
        // 유저 세션이 조회될 때마다 실행되는 코드
        session : async({ session, token } : {session: CustomSession, token: JWT}) =>{
            session.user = token.user as User;
            return session
        }
    },
    secret: `${process.env.SECRET}`,
}
const handler = nextAuth(authOptions);

export {handler as GET, handler as POST}