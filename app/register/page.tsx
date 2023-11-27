'use client';
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

interface formType {
    email: string;
    password: string;
    name: string;
    nickname: string;
}

export default function Register(){

    const [formData, setFormData] = useState<formType>({
        email: '',
        password: '',
        name: '',
        nickname: ''
    });

    const [message, setMessage] = useState<string>("");

    const changeEvent = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setFormData({...formData,[e.target.name] : e.target.value})
        // console.log(formData)
    }

    const submitEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                const data = await res.json();
                const result = data.data;
                console.log(data);
                setMessage(data.message);
                if (data.message === '성공') {
                    alert('회원가입이 완료되었습니다.');
                    window.location.href= '/';
                    signIn('credentials', {
                        email: result.email,
                        password: result.password,
                        callbackUrl: '/',
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return(
        <>
        <p>{message}</p>
        <div className="flex justify-between w-full flex-wrap items-center py-48">
            <div className="basis-9/12 sm:basis-7/12 md:basis-5/12 lg:basis-4/12 mx-auto">
                <form onSubmit={submitEvent} method="POST">
                    <p>이메일</p>
                    <input onChange={changeEvent} type="text" placeholder="이메일" name="email" required className="px-2 border border-l-pink-500 border-l-2 w-full focus:outline-gray-400 h-[50px] mx-auto mb-2" />
                    <p>비밀번호</p>
                    <input onChange={changeEvent} type="password" placeholder="비밀번호" name="password" required className="px-2 border border-l-pink-500 border-l-2 w-full focus:outline-gray-400 h-[50px] mx-auto mb-2" />
                    <p>이름</p>
                    <input onChange={changeEvent} type="text" placeholder="이름" name="name" required className="px-2 border border-l-pink-500 border-l-2 w-full focus:outline-gray-400 h-[50px] mx-auto" />
                    <p>닉네임</p>
                    <input onChange={changeEvent} type="text" placeholder="닉네임" name="nickname" required className="px-2 border border-l-pink-500 border-l-2 w-full focus:outline-gray-400 h-[50px] mx-auto" />
                    <div className="mt-5 flex flex-wrap justify-center">
                        <button type="submit" className="basis-[48%] px-6 py-2.5 bg-gray-800 text-white font-medium text-base mt-2 leading-tight uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out">가입하기</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}