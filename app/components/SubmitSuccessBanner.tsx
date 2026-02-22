"use client";

import { useEffect, useState } from "react";

export function SubmitSuccessBanner({ show }: { show: boolean }) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }, 5000);
    return () => clearTimeout(t);
  }, [show]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      className="mb-6 rounded-xl border border-green-500/30 bg-green-500/15 px-4 py-3 text-green-200"
    >
      Submission complete. Your info is now on the list below.
    </div>
  );
}
