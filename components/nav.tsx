import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Logout from './logout';
import Login from './login';

interface userInfo {
    user:{
      name: string;
      email?: string;
      image?: string;
      level? : number;
    }
  }

export default async function Nav(){

    const session = await getServerSession(authOptions) as userInfo;

    return(
        <>
        {
            session && session.user ? 
            <>
            <div className='w-[98%] flex justify-end items-center mt-2'>
                <Link href='/register'><span className='p-1 ml-2'>회원가입</span></Link>
                <Logout />
                {
                session && session.user.level === 10 ? 
                <p>level: 관리자</p>
                : 
                session && session.user !== null && 'level: 일반회원'
                }
            </div>
            <p>{session && session.user?.name}님 반갑습니다.</p>
            </>
            :
            <>
            <div className='w-[98%] flex justify-end items-center mt-2'>
                <Link href='/register'><span className='p-1 ml-2'>회원가입</span></Link>
                <Login />
            </div>
            </>   
        }
    </>

    )
}