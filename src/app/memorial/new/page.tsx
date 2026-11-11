import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { NewMemorialForm } from './NewMemorialForm'

export const metadata = { title: 'Add a Memorial' }

export default async function NewMemorialPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl text-[#182B42] mb-2">Add a Memorial</h1>
      <p className="text-stone-500 text-sm mb-8">
        Start with the basics — you can add timeline events, equipment, and oral history after saving.
      </p>
      <NewMemorialForm />
    </div>
  )
}
