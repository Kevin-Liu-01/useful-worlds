import Head from "next/head";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Wild page fled — Kevin Liu</title>
        <meta
          name="description"
          content="This page fled. Return to Kevin Liu's experimental portfolio of agent infrastructure, interfaces, and games."
        />
        <meta name="robots" content="noindex" />
      </Head>
      <main className="project-index-grid flex min-h-screen items-center justify-center bg-[#f4f3ec] p-5 text-black sm:p-10">
        <section
          className="relative grid w-full max-w-6xl overflow-hidden border border-black bg-[#f4f3ec] lg:grid-cols-12"
          style={{
            clipPath:
              "polygon(0 22px, 22px 0, calc(100% - 42px) 0, calc(100% - 30px) 12px, 100% 12px, 100% calc(100% - 22px), calc(100% - 22px) 100%, 30px 100%, 18px calc(100% - 12px), 0 calc(100% - 12px))",
          }}
        >
          <div className="flex min-h-[520px] flex-col justify-between p-7 sm:p-12 lg:col-span-7 lg:border-r lg:border-black">
            <div className="flex items-center justify-between font-kode text-[9px] uppercase tracking-[0.2em] text-black/50">
              <span>Error / Encounter 404</span>
              <span className="h-2 w-2 animate-pulse rounded-full bg-black" />
            </div>
            <div>
              <p className="font-kode text-[9px] uppercase tracking-[0.2em]">
                The wild page fled
              </p>
              <h1 className="mt-5 font-telegraf text-[clamp(5rem,15vw,10rem)] font-black leading-[0.72] tracking-[-0.09em]">
                4<span className="font-normal italic">0</span>4
              </h1>
              <p className="mt-8 max-w-md font-nacelle text-lg leading-relaxed text-black/60">
                Nothing lives at this coordinate. The work, the archive, and one
                suspiciously playable old portfolio are still nearby.
              </p>
            </div>
            <Link
              href="/"
              className="group flex items-center justify-between border-t border-black pt-5 font-kode text-[10px] uppercase tracking-[0.18em]"
            >
              <span className="flex items-center gap-3">
                <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                Return to portfolio
              </span>
              <span>Run</span>
            </Link>
          </div>

          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-black lg:col-span-5 lg:min-h-[520px]">
            <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]" />
            <div className="relative h-52 w-52 animate-[spin_18s_linear_infinite] overflow-hidden rounded-full border-[14px] border-white bg-black shadow-[0_0_0_1px_#fff] sm:h-64 sm:w-64">
              <span className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
              <span className="absolute left-0 top-1/2 h-3 w-full -translate-y-1/2 bg-white" />
              <span className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-[8px] border-white bg-black" />
            </div>
            <span className="absolute bottom-7 left-7 font-kode text-[8px] uppercase tracking-[0.2em] text-white/55">
              Signal lost / try another route
            </span>
          </div>
        </section>
      </main>
    </>
  );
}
