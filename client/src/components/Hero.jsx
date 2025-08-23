export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow p-8 md:p-12 mb-8">
      <h1 className="text-3xl md:text-5xl font-bold leading-tight">SkillSync</h1>
      <p className="mt-3 md:mt-4 text-white/90 max-w-2xl">AI-powered peer-to-peer learning platform. Find mentors, plan study paths, and collaborate in real time.</p>
      <div className="mt-6 flex gap-3">
        <a href="/register" className="bg-white text-blue-700 px-5 py-2.5 rounded font-medium">Get Started</a>
        <a href="/login" className="border border-white/80 px-5 py-2.5 rounded font-medium">I already have an account</a>
      </div>
    </section>
  )
}