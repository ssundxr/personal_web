import { login } from './actions'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const errorType = params.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Sunder OS Login</h1>
          <p className="text-sm text-gray-500 mt-1">Access the internal ecosystem.</p>
        </div>
        
        {errorType === 'true' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
            Invalid email or password. Please verify your credentials or ensure the user exists in Supabase.
          </div>
        )}

        {errorType === 'unauthorized' && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm font-medium">
            Access denied. This account does not have admin privileges in the profiles database.
          </div>
        )}
        
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900"
            />
          </div>
          <button 
            formAction={login}
            className="mt-4 w-full px-4 py-2 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-900/90 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
