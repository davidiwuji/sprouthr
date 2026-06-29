import { redirect } from 'next/navigation';
export default function GrantsPage() {
  redirect('/browse?category=grant');
}
