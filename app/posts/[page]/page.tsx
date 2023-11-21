import db from '@/db';
import { RowDataPacket } from 'mysql2/promise';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Search from '@/components/search';

interface userInfo {
  user:{
    name: string;
    email?: string;
    image?: string;
    level? : number;
  }
}

export default async function PostList({
    params,
} : {params?: {page ?: number}}) {

    console.log(params)
  const currentPage =  params?.page !== undefined ? params.page : 1;
  // 현재 파라미터가 값이 없다면 1페이지가 되고 그게 아니라면 해당 페이지로 접속
  const perPage = 5;
  const offset = (currentPage - 1) * perPage;


  const [results] = await db.query<RowDataPacket[]>('SELECT * FROM board.board order by date DESC limit ? offset ?',[perPage, offset]);
  const [countResult] = await db.query<RowDataPacket[]>('select count(*) as cnt from board.board')

  const totalCnt = countResult[0].cnt
  const lastPage = Math.ceil(totalCnt / perPage);
  const totalPageCnt = 5;
  const startPage = Math.floor((currentPage - 1) / totalPageCnt)* totalPageCnt + 1
  const endPage = Math.min(lastPage, startPage + totalPageCnt - 1);
  let prevStart = Math.floor((currentPage - 1) / 5)* 5 - 4;
  let nextStart = Math.ceil((currentPage)/ 5)* 5 + 1;

  let sessions = await getServerSession(authOptions) as userInfo;
  console.log(sessions)

  return (
    <>
      <div className="mx-auto max-w-7xl p-6 items-center mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className='text-2xl font-semibold'>게시판</h1>
          {
            sessions && 
            <Link href="/write" className='bg-pink-200 text-white px-4 py-2 rounded shadow-md hover:bg-pink-300'>글쓰기</Link>
          }
        </div>
        <div className="bg-white shadow-md rounded-lg">
          <ul className="bg-gray-100 flex justify-between">
            <li className='px-6 basis-2/12 py-3 text-center'>번호</li>
            <li className='px-6 basis-6/12 py-3 text-center'>제목</li>
            <li className='px-6 basis-2/12 py-3 text-center'>작성자</li>
            <li className='px-6 basis-2/12 py-3 text-center'>작성일</li>
          </ul>
          {
            results && results.map((e,i)=>{
              const date = new Date(e.date)
              const year = date.getFullYear();
              const month = (date.getMonth() + 1).toString().padStart(2, "0");
              const day = date.getDate().toString().padStart(2, "0");
              const formaDate = `${year}-${month}-${day}`
              const number = totalCnt - ((currentPage - 1) * perPage + i)
              return(
                <ul className='flex justify-between' key={i}>
                  <li className='px-6 basis-2/12 py-3 text-center'>{number}</li>
                  <Link href={`/post/${e.id}`} className='px-6 basis-6/12 py-3 text-center'>{e.title}</Link>
                  <li className='px-6 basis-2/12 py-3 text-center'>{e.username}</li>
                  <li className='px-6 basis-2/12 py-3 text-center'>{formaDate}</li>
                </ul>
              )
            })
          }
        </div>
      </div>
      <div className='flex justify-center gap-x-5 mb-5'>
        {
        currentPage > 5 && <Link href={`/posts/${prevStart}`} className='bg-white border px-1.5 py-1 text-sm rounded text-black'>이전</Link>
        }
        {
          Array(endPage - startPage + 1).fill(null).map((_,i)=>{
            const pageNumber = i + startPage;
            return(
                <Link key={i} href={`/posts/${pageNumber}`} className='bg-white border px-1.5 py-1 text-sm rounded'>{pageNumber}</Link>
            )
          })
        }
        {
            nextStart <= lastPage && <Link href={`/posts/${nextStart}`} className='bg-white border px-1.5 py-1 text-sm rounded'>다음</Link>
        }
      </div>
      <Search />
    </>
  )
}
