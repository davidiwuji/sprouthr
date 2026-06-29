import { redirect } from 'next/navigation';
export default function JobsPage() {
  redirect('/browse?category=job');
}
