'use client';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useCustomSession from "../sessions";

interface formType {
    userid: string;
    username: string;
    title: string;
    content: string;
}

export default function Write(){

    const {data: session} = useCustomSession();

    const [formData, setFormData] = useState<formType>({

        userid: session?.user?.email ?? '',
        username : session?.user?.name ?? '',
        title : '',
        content : ''
    });

    useEffect(()=>{
        setFormData({
            userid: session?.user.email ?? '',
            username: session?.user.name ?? '',
            title: '',
            content: ''
        })
    },[session?.user.name, session?.user.email])
    
    const changeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        setFormData({...formData, [e.target.name] : e.target.value});
        console.log(formData)
    }

    const submitEvent = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
            const res = await fetch('/api/write', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if(res.ok){
                const data = await res.json();
                console.log(data.message);
                alert("정상적으로 등록 하였습니다.")
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
        <div className="mx-auto w-full h-full">
            <div className="mt-10 md:mt-20 max-w-7xl mx-auto border rounded-lg h-[625px]">
                <p className="bg-gray-100 text-center text-2xl p-1">글쓰기</p>
                <div className="">
                    <form method="post" onSubmit={submitEvent}>
                        <div className="flex justify-between flex-wrap max-w-7xl mx-auto mt-5 text-start">
                            <div className="basis-[95%] mx-auto items-center border-b mb-3">
                                <span className="mr-5 text-2xl text-gray-400">작성자</span><input type="text" name="name" value={session && session.user.name} onChange={changeEvent} className=" text-gray-700 text-xl mb-2 mr-5 w-[90%] p-2 focus:outline-none" />
                            </div>
                            <div className="basis-[95%] items-center border-b mx-auto mb-3">
                                <span className="mr-9 text-2xl text-gray-400">제목</span><input type="text" name="title" value={formData.title} onChange={changeEvent} className="text-xl mb-2 mr-5 p-2 w-[90%] focus:outline-none" />
                            </div>
                            <div className="basis-[95%] mx-auto">
                                <span className="mr-5 text-2xl text-gray-400">내용</span><textarea name="content" value={formData.content} onChange={changeEvent} className="text-gray-700 p-3 text-xl mb-2 border focus:outline-none w-full h-80 mt-3"></textarea>
                            </div>
                        </div>
                        <div className="ml-[86%]">
                            <Link href='/' className="bg-violet-300 text-white px-4 py-2.5 rounded shadow-md hover:bg-violet-400 focus:outline-none mr-5">취소</Link>
                            <button className="bg-pink-200 text-white px-4 py-2 rounded shadow-md hover:bg-pink-300 focus:outline-none">등록</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}