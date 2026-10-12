"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function useResource(path) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    api(path, { signal: controller.signal })
      .then(setData)
      .catch((error) => {
        if (controller.signal.aborted) return;
        if (error.status === 401) router.replace("/");
        else setError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [path, version, router]);

  function reload() {
    setError("");
    setLoading(true);
    setVersion((value) => value + 1);
  }

  return { data, setData, error, setError, loading, reload };
}
