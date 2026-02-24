import { LoginForm } from './login-form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const params = await searchParams
  const nextPath = params.next || '/admin'
  const forbidden = params.error === 'forbidden'

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-[#050505] text-white px-4 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-black/80 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
        <p className="text-xs uppercase tracking-[0.28em] text-[#f19b32]">XKSPROD Admin</p>
        <h1 className="mt-3 text-3xl font-semibold">Connexion sécurisée</h1>
        <p className="mt-2 text-sm text-white/60">Accès réservé aux administrateurs.</p>

        <LoginForm nextPath={nextPath} forbidden={forbidden} />
      </div>
    </main>
  )
}
