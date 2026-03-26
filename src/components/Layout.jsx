import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.10),_transparent_22%),linear-gradient(to_bottom_right,_#020617,_#0f172a,_#111827)]" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="mx-auto flex-grow w-full max-w-[1280px] px-3 pb-8 pt-20 sm:px-4 sm:pb-10 sm:pt-24 md:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}