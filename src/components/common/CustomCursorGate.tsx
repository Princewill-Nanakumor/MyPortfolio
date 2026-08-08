"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });

/** Client gate so root layout can lazy-load the cursor without `ssr: false` in a Server Component. */
export default function CustomCursorGate() {
  return <CustomCursor />;
}
