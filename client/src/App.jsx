import Hero from './components/Hero'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Hero />
      <section className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-1">AI Study Plans</h3>
          <p className="text-gray-600 text-sm">Get tailored study paths with OpenAI-powered suggestions.</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-1">Peer Matchmaking</h3>
          <p className="text-gray-600 text-sm">Find mentors and learners based on your skills and goals.</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-1">Sessions & Chat</h3>
          <p className="text-gray-600 text-sm">Schedule sessions, chat in real time, and earn certificates.</p>
        </div>
      </section>
      <Footer />
    </>
  )
}
