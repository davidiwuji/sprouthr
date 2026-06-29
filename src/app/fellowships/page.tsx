import { redirect } from 'next/navigation';
export default function FellowshipsPage() {
  redirect('/browse?category=fellowship');
}
