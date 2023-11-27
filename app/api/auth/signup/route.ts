import { NextRequest, NextResponse } from "next/server";
import db from '@/db'
import bcrypt from 'bcrypt';
import { RowDataPacket } from "mysql2";

interface formType {
    email: string;
    password: string;
    name: string;
    birthday: number;
    nickname? : string;
    level?: number;
    type?: string;
    id?: number;
}

export const POST = async (req: NextRequest) : Promise<NextResponse> =>{
    if(req.method === "POST"){

        let { email, password, name, birthday, nickname, level, type, id } : formType = JSON.parse(await req.text());

        level = level === undefined ? 2 : level;

        if(type === 'edit'){

            const [chkMember] = await db.query<RowDataPacket[]>('select password from board.member where email = ?', [email])

            if(password === chkMember[0].password){

                await db.query<RowDataPacket[]>('update board.member set email = ?, name = ?, nickname = ?, level = ? where id = ?', [email, name, nickname, level, id])

            }else{

                const hash =  await bcrypt.hash(password, 10);

                await db.query<RowDataPacket[]>('update board.member set email = ?, password = ?, name = ?, nickname = ?, level = ? where id = ?', [email, password, name, nickname, level, id])
            }
            return NextResponse.json({message: "성공", data: name})
        }

        if(!email || !password || !name || !birthday){
            return NextResponse.json({message: "데이터가 부족합니다."}) 
        }

        const hash = await bcrypt.hash(password, 10) // password를 hash로 저장

        const [checkMember] = await db.query<RowDataPacket[]>('select count(*) as cnt from board.member where email = ?', [email]) // email 중복 체크
        const memberCnt = checkMember[0].cnt;
        
        // 회원가입 버튼 눌렀을때 실행
        if(memberCnt > 0){
            return NextResponse.json({message: "해당 이메일이 이미 존재합니다."})
        }else{
            await db.query('insert into board.member (email, password, name, birthday) values(?,?,?,?)',[email, hash, name, birthday]);
            const data = {
                emial: email,
                password: password,
                birthday: birthday
            }
            return NextResponse.json({message: "성공", data: data})
        }
        }else{
        return NextResponse.json({message: "실패"})
    }
}