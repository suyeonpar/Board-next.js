import { useSession } from "next-auth/react";
import { userInfo } from "os";

interface userInfo {
    user: {
        name: string;
        email: string;
        image?: string;
        level?: number;
    }
}

interface csSession {
    data: userInfo | null;
    status: "loading" | "authenticated" | "unauthenticated"
}

export default function useCustomSession():csSession{
    const {data, status} = useSession();
    return {data: data as userInfo, status}
}