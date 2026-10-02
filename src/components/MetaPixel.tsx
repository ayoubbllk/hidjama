"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackMetaEvent } from "@/lib/meta-pixel";

export default function MetaPixel() {
  const pathname = usePathname();
  const isFirstView = useRef(true);

  useEffect(() => {
    if (isFirstView.current) {
      isFirstView.current = false;
      return;
    }
    trackMetaEvent("PageView");
  }, [pathname]);

  return null;
}
