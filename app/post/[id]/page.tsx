'use client';
import { useParams } from "next/navigation";
import React,{useEffect, useState} from "react";
import Link from 'next/link';
import useCustomSession from "@/app/sessions";
import Comment from "@/app/comment";

interface PostList {
    id: number;
    title: string;
    content: string;
    userid: string;
    username: string;
    date: string;
    count: number;
}

export default function Detail(){

    const params = useParams();
    const [post, setPost] = useState<PostList[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {data: session} = useCustomSession();

    useEffect(()=>{
        const fetchData = async () =>{
           //배열의 마지막 값을 가지고 오는 방법 pop
            const res = await fetch(`/api/post/${params.id}`)
            const data = await res.json();
            console.log(data)
            setPost(data.data);
            setIsLoading(false);
        }
        fetchData();
    },[params.id])

    const deletePost = async (e: number) =>{
        try{
            const res = await fetch('/api/delete', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({id: e})
            })
            console.log(e)
            if(res.ok){
                const data = await res.json();
                console.log(data.message);
                alert("정상적으로 삭제되었습니다.")
                window.location.href="/"
            }else{
                const errorData =  await res.json();
                console.log(errorData.error);
            }
        }catch(error){
            console.log(error);
        }
    }

    return(
        <>
        {isLoading && <Loading />}
        <div className="w-full mx-auto">
            {
                post.length > 0 && (
                    <>
                    <div className="max-w-7xl border mx-auto mt-10 rounded-md flex flex-wrap justify-center">
                        <div className="border-b basis-[95%] py-2">
                            <p className="mb-5 text-end text-gray-500">작성일: {post && post[0]?.date}</p>
                            <p className="text-2xl text-gray-300">작성자: <span className="text-xl text-black">{post && post[0]?.username}</span></p>
                        </div>
                        <div className="border-b basis-[95%] py-2">
                            <p className="text-xl text-black"><span className="mr-6 text-2xl text-gray-300">제목: </span>{post && post[0]?.title}</p>
                        </div>
                        <div className="border-b basis-[95%] py-2">
                            <p className="text-xl text-black"><span className="mr-6 text-2xl text-gray-300">내용: </span>{post && post[0]?.content}</p>
                        </div>
                        {
                        session ? <Comment id={post && post[0]?.id} /> : <p className="block border p-4 text-center my-5 rounded-md"><Link href ="/login">로그인 이후 댓글을 작성할 수 있습니다.</Link></p>
                        }








                        
                    </div>
                    </>
                )
            }
            {
                session && session.user && (
                    (post && post[0] && session.user.email === post[0].userid || session.user.level === 10)
                    && <>
                    <Link href={`/edit/${params.id}`}><button className='bg-pink-200 text-white px-4 py-2 rounded shadow-md hover:bg-pink-300 focus:outline-none'>수정</button></Link>
                    <button className='bg-violet-300 text-white px-4 py-2 rounded shadow-md hover:bg-violet-400 focus:outline-none' onClick={()=>{deletePost(post && post[0]?.id)}}>삭제</button></>
                )
            }

        </div>
        </>
    )
}

function Loading(){
    return(
        <div className="fixed w-full h-full bg-black/50 top-0 left-0 z-50">
        <div className="absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4">
        <svg width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <g transform="rotate(0 50 50)">
        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="pink">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
        </rect>
        </g>
        <g transform="rotate(30 50 50)">
        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="pink">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
        </rect>
        </g>
        <g transform="rotate(60 50 50)">
        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="pink">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
        </rect>
        </g>
        <g transform="rotate(90 50 50)">
        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="pink">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
        </rect>
        </g>
        <g transform="rotate(120 50 50)">
        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="pink">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
        </rect>
        </g>
        <g transform="rotate(150 50 50)">
        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="pink">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
        </rect>
        </g>
        <g transform="rotate(180 50 50)">
        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="pink">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
        </rect>
        </g>
        <g transform="rotate(210 50 50)">
        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="pink">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
        </rect>
        </g>
        <g transform="rotate(240 50 50)">
        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="pink">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
        </rect>
        </g>
        <g transform="rotate(270 50 50)">
        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="pink">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
        </rect>
        </g>
        <g transform="rotate(300 50 50)">
        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="pink">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
        </rect>
        </g>
        <g transform="rotate(330 50 50)">
        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="pink">
        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
        </rect>
        </g>
        </svg>
        </div>
      </div>
    )
}