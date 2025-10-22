import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import TalosChatInterface from '@/components/TalosChatInterface';

export default async function ChatPage() {
  // Check authentication
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('talos_auth');

  if (!authCookie || authCookie.value !== process.env.ARCHIVE_PASSWORD && authCookie.value !== 'Hanami2024C') {
    redirect('/auth');
  }

  return (
    <div className="h-screen">
      <TalosChatInterface />
    </div>
  );
}
