import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6">
      <h1 className="text-3xl font-bold mb-6">🎟 Conference Registration</h1>

      <div className="space-y-4 w-full max-w-md">
        <Link
          href="/register/ieee"
          className="block bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700"
        >
          Register – IEEE Members
        </Link>

        <Link
          href="/register/non-member"
          className="block bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700"
        >
          Register – Non-Members
        </Link>

        <Link
          href="/responses"
          className="block bg-purple-600 text-white text-center py-3 rounded-lg hover:bg-purple-700"
        >
          📋 View All Responses
        </Link>
      </div>
    </div>
  );
}
