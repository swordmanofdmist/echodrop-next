export async function api(path, { body, ...options } = {}) {
  const isFormData = body instanceof FormData;
  const response = await fetch(path, {
    ...options,
    cache: "no-store",
    ...(body !== undefined && {
      ...(!isFormData && { headers: { "Content-Type": "application/json" } }),
      body: isFormData ? body : JSON.stringify(body)
    })
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.error || "Something went wrong. Please try again.");
    error.status = response.status;
    throw error;
  }
  return data;
}
