import db from '@/db';
import { RowDataPacket } from 'mysql2/promise';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import PostList from './posts/[page]/page';

interface userInfo {
  user:{
    name: string;
    email?: string;
    image?: string;
    level? : number;
  }
}

export default async function Home() {

  return (
    <>
      <PostList />
    </>
  )
}
