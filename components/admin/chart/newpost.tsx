'use client'

import Link from "next/link";
import { useEffect, useState } from "react"



interface postType{
    id: number;
    parentid?: number;
    title?: string;
    content : string;
    userid : string;
    username: string;
    count?: number;
    cate: string;
}


export default function NewPost() {
    const [postData, setPostData] = useState<postType[]>()
    const [commentData, setCommentData] = useState<postType[]>()

    useEffect(()=>{
        const fetchData = async()=>{
        try{
       
                const res = await fetch('/api/admin',{
                    cache : "no-cache",
                    method:"POST",
                    headers :{
                        'Content-Type' : 'application/json'
                    },          
                    body : JSON.stringify({
                            pathUrl: 'mainPost'
                    })
                    
                })
                const  data = await res.json();
                setPostData(data.data.newPost)
                setCommentData(data.data.newComment)
             
                if(!res.ok){
                    console.log('에러가 발생하였습니다')
                    return
                }
                
                return data;
            

        }catch(error){
            console.log(error)
        }
        }
        fetchData()
    },[])


    return(
    <div className="mt-5 md:mt-0 basis-full md:basis-[49.3%]">
        <div className="widget mb-5">
            <div className="font-bold p-5 py-3 flex justify-between">
                <h3>신규 게시물</h3>
                <Link href="/admin/member" className="focus:outline-none focus:ring-red-400 focus:ring-2 font-medium rounded-lg text-sm p-5 bg-slate-400 py-2.5">게시물 전체</Link>

            </div>
            <div className="w-full">
                <ul className="flex py-4 text-sm justify-between border-b bg-[#444] text-white">
                    <li className="basis-[33%] text-white font-bold text-center text-xs sm:text-sm">닉네임</li>
                    <li className="basis-[40%] text-white font-bold text-center text-xs sm:text-sm">제목</li>
                    <li className="basis-[20%] text-white font-bold text-center text-xs sm:text-sm" >작성일</li>
                </ul>
            </div>
        </div>
        <div className="widget md:mb-5">
            <div className="font-bold p-5 py-3 flex justify-between">
                <h3>신규 댓글</h3>
                <Link href="/admin/member" className="focus:outline-none focus:ring-red-400 focus:ring-2 font-medium rounded-lg text-sm p-5 bg-slate-400 py-2.5">댓글 전체</Link>

            </div>
            <div className="w-full">
                <ul className="flex py-4 text-sm justify-between border-b bg-[#444] text-white">
                <li className="basis-[33%] text-white font-bold text-center text-xs sm:text-sm">닉네임</li>
                <li className="basis-[40%] text-white font-bold text-center text-xs sm:text-sm">제목</li>
                <li className="basis-[20%] text-white font-bold text-center text-xs sm:text-sm" >작성일</li>
                </ul>
            </div>
        </div>
    </div>
    )
};
