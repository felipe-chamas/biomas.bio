import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import TalosArchive from '@/components/TalosArchive';

export default async function Home() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('talos_auth');
  
  if (auth?.value !== process.env.ARCHIVE_PASSWORD) {
    redirect('/auth');
  }

  return <TalosArchive />;
}
