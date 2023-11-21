import db from '@/db';
import { RowDataPacket } from 'mysql2';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import Comment from '@/components/comment';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import EditDelete from './editDelete';

interface userInfo {
    user: {
        name: string;
        emial?: string;
        image?: string;
        level?: number;
    }
}

interface propsType {
    results:{
        id: number;
        userid: string;
        title?: string;
        content?: string;
        username?: string;
        count?: number;
        date?: string;
    }
}

async function Getip(){
    const res = await fetch('http://localhost:3000/api/get-ip');
    const data  = res.json();
    if(!res.ok){
        alert("에러가 발생하였습니다.");
        return;
    }
    return data;
}

export default async function Detail({
params
} : {
        params ? : {id?: number}
}){
    const getIp = await Getip();
    const userIp = getIp.data
    console.log(userIp)
    const postId = params?.id !== undefined ? params.id : 1;
    const [results] = await db.query<RowDataPacket[]>('select * from board.board where id = ?', [postId])
    const post = results && results[0]
    let session = await getServerSession(authOptions) as userInfo;
    //console.log(postId)
    const date = new Date(post.date)
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = (date.getHours()+9).toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const formaDate = `${year}-${month}-${day}-${hours}시${minutes}분${seconds}초`
    const [countResult] = await db.query<RowDataPacket[]>('select count (*) as cnt from board.view_log where postid = ? and ip_address = ?', [postId, userIp]);
    const totalCnt = countResult[0].cnt;
   // console.log(totalCnt+"개")

    if(results.length > 0){
        if(totalCnt === 0){
        await db.query<RowDataPacket[]>('update board.board set count = count + 1 where id = ?', [postId])

    }
       await db.query<RowDataPacket[]>('insert into board.view_log (postid, ip_address, view_date) select ?, ?, NOW() where not exists (select 1 from board.view_log where postid = ? and ip_address = ? and view_date > now() - interval 24 hour)', [postId, userIp, postId, userIp])
    // select 1 = 존재 여부를 확인하기 위해 사용 > 1이라는 건 상수 값으로 실제 데이터는 중요하지 않으며, 존재 여부를 확인하기 위함
    // 내가 원하는 데이터에서 어떠한 조건 즉 and 까지 포함한 3가지 조건이 모두 충족하는 조건을 찾는다.
    // 어떠한 행도 반환하지 않을 때만 참이 된다. 즉 3가지 조건이 모두 참일 때 혹은 데이터가 없을때 쿼리가 실행
    }

    return(
        <>
        <div className="w-full mx-auto h-auto">
            {
                results.length > 0 && (
                    <>
                    <div className="max-w-7xl h-auto border mx-auto mt-10 rounded-md flex flex-wrap justify-center relative">
                        <div className="border-b basis-[95%] py-2">
                        <span className="text-xl text-black">조회수: {post?.count}</span>
                            <p className="mb-5 text-end text-gray-500">작성일: {formaDate}</p>
                            <p className="text-2xl text-gray-300">작성자: <span className="text-xl text-black">{post?.username}</span></p>
                        </div>
                        <div className="border-b basis-[95%] py-2">
                            <p className="text-xl text-black"><span className="mr-6 text-2xl text-gray-300">제목: </span>{post?.title}</p>
                        </div>
                        <div className="border-b basis-[95%] py-2 mb-14">
                            <p className="text-xl text-black"><span className="mr-6 text-2xl text-gray-300">내용: </span>{post?.content}</p>
                        </div>
                        <div className='absolute bottom-2 right-2'>
                            <EditDelete results={post as propsType['results']} />
                        </div>
                    </div>
                    </>
                )
            }
            <div className='mt-5'>
                {
                session ? <Comment id={post?.id} /> : <p className="block border p-4 text-center my-5 rounded-md"><Link href ="/login">로그인 이후 댓글을 작성할 수 있습니다.</Link></p>
                }
            </div>
        </div>
        </>
    )
}
