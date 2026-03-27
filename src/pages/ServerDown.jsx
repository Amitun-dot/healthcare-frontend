export default function ServerDown() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <div className="text-center space-y-5 px-6 max-w-md">
        <h1 className="text-4xl font-bold text-red-500">
          Server Unreachable 🚫
        </h1>

        <p className="text-gray-700">
          The server is currently unavailable. Please try again later.
        </p>
      </div>
    </div>
  );
}