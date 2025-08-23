import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-2">Page not found</h1>
      <p className="text-gray-600 mb-4">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="text-blue-600 hover:underline">Go home</Link>
    </div>
  )
}