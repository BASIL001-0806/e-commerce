import Link from "next/link";
import { ArrowIcon, SearchIcon } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-[84px] font-extrabold leading-none text-slate-200">404</p>
      <h1 className="mt-2 text-[26px] font-extrabold text-ink">We could not find that page</h1>
      <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-muted">
        The link may be old, the product may have been discontinued, or the page simply never existed.
        The catalogue is the fastest way back.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        <Link href="/shop" className="btn btn-primary">
          <SearchIcon className="h-4 w-4" /> Browse all products
        </Link>
        <Link href="/" className="btn btn-ghost">
          Go to home page <ArrowIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
