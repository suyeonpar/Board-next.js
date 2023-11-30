'use client'

import Link from "next/link";
import { useEffect, useState } from "react"



interface userType{
    id: number;
    email:string;
    name: string;
    nickname?:string;
    level : number;
    date: string;    
}


export default function NewMember() {
    const [userData, setUserData] = useState<userType[]>()

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
                            pathUrl: 'mainNewMember'
                    })
                    
                })
                const  data = await res.json();
                setUserData(data.data)
             
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

    const listItem = ["아이디","이름", "닉네임" , "가입일"]
  
    return(
    <div className="widget basis-full md:basis-[49.3%]">
        <div className="font-bold p-5 py-3 flex justify-between">
            <h3>신규 회원</h3>
            <Link href="/admin/member" className="focus:outline-none focus:ring-red-400 focus:ring-2 font-medium rounded-lg text-sm p-5 bg-slate-400 py-2.5">회원 전체</Link>

        </div>
        <div className="w-full">
            <ul className="flex py-4 text-sm justify-between border-b bg-[#444] text-white">
                {
                    listItem.map((e,i)=>{
                        return(
                    
                            <li className="basis-1/5 text-white font-bold text-center text-xs sm:text-sm" key={i}>{e}</li>
                        )
                    })
                }
            </ul>
            {
                userData && userData.map((e,i)=>{
                    const date = new Date(e.date);
                    const year=date.getFullYear();
                    const month = (date.getMonth()+1).toString().padStart(2,'0');
                    const hour = (date.getHours()+9).toString().padStart(2,'0')
                    const minutes = (date.getMinutes()).toString().padStart(2,'0')
                    const seconds = (date.getSeconds()).toString().padStart(2,'0')
                    const formatDate = `${hour}:${minutes}:${seconds}`

                    return(
                        <ul key={i} className="flex justify-between border-b last:border-0 items-center py-2.5">
                            
                            <li className="basis-[23%] font-bold text-center text-xs sm:text-s" >{e.email}</li>
                            <li className="basis-1/5 font-bold text-center text-xs sm:text-sm" >{e.name}</li>
                            <li className="basis-1/5 font-bold text-center text-xs sm:text-sm" >{e.nickname}</li>
                            <li  className="basis-1/5 font-bold text-center text-xs sm:text-sm" >{formatDate}</li>
                        </ul>
                    )
                })
            }
        </div>
    </div>
    )
};
