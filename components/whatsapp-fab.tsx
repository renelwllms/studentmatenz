import Link from "next/link";

export function WhatsAppFab() {
  return (
    <Link
      href="https://wa.me/6421841446?text=Hi%20Tina%2C%20I%20need%20help%20with%20StudentMate%20services!"
      className="fixed bottom-5 right-5 z-50 flex items-center rounded-full bg-[#25D366] px-5 py-3 text-white shadow-lg shadow-[#25D36666] transition hover:-translate-y-0.5 hover:shadow-[#25D36699]"
      aria-label="Chat with Tina on WhatsApp"
      target="_blank"
      rel="noreferrer"
    >
      <svg
        viewBox="0 0 32 32"
        className="mr-2 h-6 w-6 fill-white"
        aria-hidden="true"
      >
        <path d="M16 3C9.4 3 4 8.4 4 15c0 2.3.7 4.5 1.9 6.4L4 29l7.9-1.8c1.8 1 3.9 1.5 6.1 1.5 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22.1c-1.9 0-3.6-.5-5.1-1.4l-.4-.2-4.7 1.1 1.2-4.6-.2-.4c-1-1.5-1.6-3.4-1.6-5.4C5.2 9.1 10.1 4.2 16 4.2S26.8 9.1 26.8 15 21.9 25.1 16 25.1zm6.2-6.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.8-2.9-1.5-4-3.4-.3-.5.3-.5.9-1.7.1-.2.1-.4 0-.6-.1-.2-.7-1.6-.9-2.2-.2-.6-.4-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.7 1.2 3.1 1.3 3.3c.2.2 2.4 3.6 5.9 5 .8.3 1.5.5 2 .6.8.2 1.6.2 2.2.1.7-.1 1.9-.8 2.1-1.6.3-.8.3-1.5.2-1.6-.1-.1-.3-.2-.6-.4z" />
      </svg>
      <span className="text-sm font-semibold">Chat with Tina</span>
    </Link>
  );
}
