import { NextRequest, NextResponse } from "next/server";
import db from '@/db'
import bcrypt from 'bcrypt';
import { RowDataPacket } from "mysql2";

interface formType {
    email: string;
    password: string;
    name: string;
}

export const POST = async (req: NextRequest) : Promise<NextResponse> =>{
    if(req.method === "POST"){
        const { email, password, name } : formType = JSON.parse(await req.text());

        if(!email || !password || !name){
            return NextResponse.json({message: "데이터가 부족합니다."}) 
        }

        const hash = await bcrypt.hash(password, 10) // password를 hash로 저장

        const [checkMember] = await db.query<RowDataPacket[]>('select count(*) as cnt from board.member where email = ?', [email]) // email 중복 체크
        const memberCnt = checkMember[0].cnt;
        
        // 회원가입 버튼 눌렀을때 실행
        if(memberCnt > 0){
            return NextResponse.json({message: "해당 이메일이 이미 존재합니다."})
        }else{
            await db.query('insert into board.member (email, password, name) values(?,?,?)',[email, hash, name]);
            const data = {
                emial: email,
                password: password
            }
            return NextResponse.json({message: "성공", data: data})
        }
        }else{
        return NextResponse.json({message: "실패"})
    }
}