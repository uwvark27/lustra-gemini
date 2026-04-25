import { redirect } from 'next/navigation';

export default function AboutUsPage() {
  // Automatically redirect to the first tab when visiting the base About Us route
  redirect('/cartwright-sites/about-us/marc');
  return null;
}
