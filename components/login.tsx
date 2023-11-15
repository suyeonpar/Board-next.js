// import useCustomSession from '@/app/sessions';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

interface userInfo {
    user:{
      name: string;
      email?: string;
      image?: string;
      level? : number;
    }
  }

interface PropsData {
    session?: userInfo | null
}

export default async function Login(){
    // const {data: session, status} = useCustomSession();
    const session = await getServerSession(authOptions) as userInfo;
    const redirectTo = () =>{
        sessionStorage.setItem('preUrl', window.location.href);
        window.location.href= "/login"
    }

    return(
        <>
        {
            session && session.user ? 
            <>
            <div className='w-[98%] flex justify-end items-center mt-2'>
                <Link href='/register'><span className='p-1 ml-2'>회원가입</span></Link>
                <Link href="/logout">로그아웃</Link>
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
                <Link href='/login'>로그인하기</Link>
            </div>
            </>   
        }
    </>

    )
}