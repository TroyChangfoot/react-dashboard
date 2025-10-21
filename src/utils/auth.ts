export function isAuthenticated(): boolean {
  const token = localStorage.getItem("access");
  return !!token; // true if token exists
}
