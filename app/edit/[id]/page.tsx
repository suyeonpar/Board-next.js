import db from '@/db';
import { RowDataPacket } from 'mysql2/promise';
import Link from 'next/link';
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';


interface PostList {
    id: number;
    title: string;
    content: string;
    author: string;
    date: string;
    count: number;
}

interface editProps {
    params : {
        id: string;
    }
}

interface userInfo {
    user:{
      name: string;
      email?: string;
      image?: string;
      level? : number;
    }
  }

export default async function Edit( props: editProps) {

    const [results] = await db.query<RowDataPacket[]>('select * from board.board where id = ?', [props.params.id]);
    console.log(props.params.id);
    const sessions = await getServerSession(authOptions) as userInfo;
    console.log(sessions)

    const editPost = async (requestData: string) => {
        try {
          const { title, content,id }: PostList = JSON.parse(requestData);
          console.log(title, content, id);
          if (!title || !content || !id) {
            return NextResponse.json({ message: '데이터가 부족합니다.' });
          } else {
            await db.query<RowDataPacket[]>('update board.board set title = ?, content = ? where id = ?', [title, content, id]);
            return NextResponse.json({ message: '성공', result: results });
          }
        } catch (error) {
          return NextResponse.json({ error: error });
        }
      };

    return(
        <>
        {
        results.length > 0
        ? 
        <div className="mx-auto w-full h-full">
            <div className="mt-10 md:mt-20 max-w-7xl mx-auto border rounded-lg h-[600px]">
                <p className="bg-gray-100 text-center text-2xl p-1">수정하기</p>
                <div className="">
                    <form method="post">
                        <div className="flex justify-between flex-wrap max-w-7xl mx-auto mt-5 text-start">
                            <div className="basis-[95%] mx-auto items-center border-b mb-3">
                                <span className="mr-5 text-xl text-gray-400">작성자</span><input type="text" name="name" className=" text-gray-700 text-sm mb-2 mr-5 w-[90%] p-2 focus:outline-none" value={results[0].username}/>
                            </div>
                            <div className="basis-[95%] items-center border-b mx-auto mb-3">
                                <span className="mr-9 text-xl text-gray-400">제목</span><input type="text" name="title" className="text-sm mb-2 mr-5 p-2 w-[90%] focus:outline-none" value={results[0].title} />
                            </div>
                            <div className="basis-[95%] mx-auto">
                                <span className="mr-5 text-xl text-gray-400">내용</span><textarea name="content" className="text-gray-700 p-2 text-sm mb-2 border focus:outline-none w-full h-80 mt-3" value={results[0].content}></textarea>
                            </div>
                        </div>
                        <div className="ml-[83.5%]">
                            <Link href='/' className="bg-violet-300 text-white px-4 py-2.5 rounded shadow-md hover:bg-violet-400 focus:outline-none mr-5">취소</Link>
                            <button className="bg-pink-200 text-white px-4 py-2 rounded shadow-md hover:bg-pink-300 focus:outline-none" type='submit'>수정하기</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        :
        <NotData />
        }
        </>
    )
}

function NotData(){
    return(
        <>
        <p>데이터가 존재하지 않습니다.</p>
        <Link href='/'>목록</Link>
        </>
    )
}