'use client';
import { useState, useRef } from "react";

export default function Search(){

    const [keyword, setKeyWord] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    const searchValue = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setKeyWord(e.target.value)
    }

    /*
    useRef = 해당 요소에 접근하기 위해 / 해당 요소의 값의 참조를 저장하기 위해 사용하며, useRef는 current 속성을 가진 객체를 반환
    
    useRef의 특징 :  참조값이 변경되어도 컴포넌트가 재랜더링 되지 않는다.
    */

    const searchSubmit = () =>{
        if(keyword === '' || null){
            alert("검색어를 입력해주세요.")
            inputRef.current?.focus();
        }else{
            window.location.href = `/search/${keyword}`;
        }
      };

    return(
        <>
        <div className="flex justify-center gap-x-5">
            <input ref={inputRef} onChange={searchValue} type="text" className="border p-2" />
            <button onClick={searchSubmit}>검색</button>
        </div>
        </>
    )
}