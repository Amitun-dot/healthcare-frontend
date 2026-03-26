import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-10">
      <div className="relative overflow-hidden border-t border-white/10 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white text-center py-4 text-sm font-medium shadow-[0_-8px_30px_rgba(59,130,246,0.25)]">
        
        {/* Soft Glow */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white,_transparent_60%)]" />

        <p className="relative z-10 tracking-wide">
          © {new Date().getFullYear()} Healthcare System · All Rights Reserved ·{" "}
          
          <Link
            to="/privacy-policy"
            className="underline cursor-pointer hover:text-white/80 transition"
          >
            Privacy Policy
          </Link>

        </p>
      </div>
    </footer>
  );
}