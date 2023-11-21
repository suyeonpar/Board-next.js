'use client';
import useCustomSession from "@/app/sessions";
import Link from 'next/link';
import React from 'react';

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

export default function EditDelete({results} : propsType) {
    
    const { data: session } = useCustomSession();

    const deletePost = async(e:number) =>{
        try{
            const res = await fetch('/api/delete',{
                method: 'POST',
                headers : {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify({id: e})
            })
            if(res.ok){
                alert("정상적으로 삭제되었습니다.")
                window.location.href= '/'
            }else{
                alert("삭제 실패")
                return;
            }
        }
        catch(error)
        {
            console.log(error)
        }
    }
    return (
        <React.Fragment>
            {
            session && session.user && (
                (results && results && (session.user.email === results.userid || session.user.level === 10)) && (
                    <>
                    <div className="">
                        <Link href={`/`}>
                            <button className='bg-pink-200 text-white mr-2 px-4 py-2 rounded shadow-md hover:bg-pink-300 focus:outline-none'>수정</button>
                        </Link>
                        <button className='bg-violet-300 text-white px-4 py-2 rounded shadow-md hover:bg-violet-400 focus:outline-none' onClick={()=>{deletePost(results && results?.id)}}>삭제</button>
                    </div>
                    </>
                )
            )}
        </React.Fragment>
    );
}

