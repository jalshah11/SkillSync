export default function App() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">SkillSync</h1>
        <nav className="space-x-4">
          <a href="/login" className="text-blue-600 hover:underline">Login</a>
          <a href="/register" className="text-blue-600 hover:underline">Register</a>
        </nav>
      </header>
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Welcome</h2>
        <p className="text-gray-700">AI-powered peer-to-peer learning platform. Get started by creating an account.</p>
      </section>
    </div>
  )
}
