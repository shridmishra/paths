
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, paths, questions, progress } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        redirect('/');
    }

    // Fetch analytics
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [pathCount] = await db.select({ count: sql<number>`count(*)` }).from(paths);
    const [questionCount] = await db.select({ count: sql<number>`count(*)` }).from(questions);
    const [progressCount] = await db.select({ count: sql<number>`count(*)` }).from(progress).where(sql`${progress.completed} = true`);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount.count}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Paths</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pathCount.count}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{questionCount.count}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{progressCount.count}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
