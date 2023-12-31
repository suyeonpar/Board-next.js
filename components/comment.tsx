/*
const {data: session} = useCustomSession();
const data = {
    id: 5,
    name: "홍길동",
    emial: "abcd@naver.com"
}

변수 내에 중괄호 {} 가 들어가면 구조 분해 할당(destructuring assignment) 해당 객체에서 그 속성을 추출해서 새로운 변수로 할당할 때 사용

예를 들어 ....data.id 이걸 변수로 저장을 따로 하고 싶다면 const {id} = data > const id = 5 값이 저장된다.
data.id로 사용도 가능...
*/ 

'use client';
import React, { useEffect, useState } from "react";
import useCustomSession from "../app/sessions";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface CommentProps {
    id: number;
}

interface formType {
    parentid: number;
    userid: string;
    username: string;
    content: string;
}

interface commentType {
    id: number;
    parentid: number;
    userid: string;
    username: string;
    content: string;
    date: string;
}

export default function Comment(props: CommentProps){

    const {id} = props;
    const commnetValue = (e: React.ChangeEvent<HTMLInputElement>) =>{
        //setComment(e.target.value);
        setFormData({...formData, [e.target.name] : e.target.value});
        console.log(formData)
    }

    const {data: session} = useCustomSession();

    const [formData, setFormData] = useState<formType>({
        parentid: id,
        userid: session?.user?.email ?? '',
        username: session?.user?.name ?? '',
        content: ''
    });

    useEffect(()=>{
        setFormData({
            parentid: id,
            userid: session?.user?.email ?? '',
            username: session?.user?.name ?? '',
            content: ''
        })
    },[session?.user.name, session?.user.email, id])


    const [totalcomment, setTotalComment] = useState<commentType[]>();
    const params = useParams();
    console.log(params)

    useEffect(()=>{
        const fetchData = async () =>{
            const res = await fetch(`/api/comment?id=${params.id}`)    
            const data = await res.json();
            setTotalComment(data.result)
        }   
        fetchData()
    },[params.id])


    const cmtSubmit = async () =>{
        try{
            const res = await fetch('/api/comment', {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            if(res.ok){
                const data = await res.json();
                console.log(data)
                setTotalComment(data.result);
            }
        }catch(error){
            console.log(error)
        }
    }

    return(
        <>
        {
            session && session.user && 
            <>
            <div className="max-w-7xl h-full flex flex-wrap justify-between mx-auto border rounded-md relative mb-5 items-center p-5">
                <div className="ml-5 basis-2/3">
                <p className="text-xl">댓글 목록</p>
                    {
                        totalcomment && totalcomment.map((e,i)=>{
                            const date = new Date(e.date)
                            const year = date.getFullYear();
                            const month = (date.getMonth() + 1).toString().padStart(2, "0");
                            const day = date.getDate().toString().padStart(2, "0");
                            const hours = (date.getHours()+9).toString().padStart(2, "0");
                            const minutes = date.getMinutes().toString().padStart(2, "0");
                            const seconds = date.getSeconds().toString().padStart(2, "0");
                            const formaDate = `${year}-${month}-${day}-${hours}시${minutes}분${seconds}초`
                            return(
                                <>
                                <div key={i} className="mb-5 mt-5 border-b">
                                    <p className="text-xs mb-2"><FontAwesomeIcon icon={faUser} /> {e.username}</p>
                                    <p className="text-base mb-2">{e.content}</p>
                                    <p className="text-sm text-gray-400 mb-3">작성일 : {formaDate}</p>
                                </div>
                                </>
                            )
                        })
                    }
                </div> 
                <div className="absolute bottom-3 right-2">
                    <input name="content" type="text" className="border rounded p-2 mr-2" onChange={commnetValue}></input>
                    <button className="bg-gray-800 hover:bg-black p-2 rounded-md text-white" onClick={cmtSubmit}>댓글 작성</button>
                </div>
            </div>
            </>
        }
        </>
    )
}