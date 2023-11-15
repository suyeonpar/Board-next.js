import db from '@/db';
import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2/promise';

export const GET = async (req:NextRequest) : 
Promise<NextResponse> =>{
    const pathname = req.nextUrl.pathname;
    const postId = pathname.split('/').pop()
    const [results] = await db.query<RowDataPacket[]>('SELECT * FROM board.board where id = ?', [postId])

    return NextResponse.json({data: results})
}