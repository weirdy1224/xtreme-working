import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-700/30 mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <a 
              href="https://github.com/Maverick341/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © 2024 CodeFlow. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
