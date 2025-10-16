import type { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Welcome',
    description: 'Affiliate Raika photography'
  };
export default async function authLayout({
    children
  }: {
    children: React.ReactNode;
  }) {
    return <div className='min-h-screen min-w-screen flex text-sm
    '>{children}</div>
  }