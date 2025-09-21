import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-700/30 mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          
          <div className="text-sm text-muted-foreground">
            © 2025 Athena. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
