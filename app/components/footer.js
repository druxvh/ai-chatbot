import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="py-3 bg-slate-100 fixed bottom-0 w-full">
      <div className="flex items-center justify-center text-black text-[12px] font-mono">
        <p>built by</p>
        <Link
          href="https://www.x.com/druxvh"
          target="_blank"
          className="ml-[6px] flex underline hover:text-gray-800 transition ease-in-out delay-300"
        >
          <span>drx</span>
          <MdArrowOutward className="size-2" />
        </Link>
      </div>
    </footer>
  );
}
