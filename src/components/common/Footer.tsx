import { SITE_NAME } from "@/lib/seo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-bg-primary">
      <div className="container flex items-center justify-center px-6 py-4 mx-auto max-w-7xl">
        <p className="text-sm text-center text-text-muted">
          © {year} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
