export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-") // ganti spasi dengan "-"
    .replace(/[^a-z0-9-]/g, ""); // hapus karakter aneh
}
