// Base path the app is deployed under (e.g. "/grains"). Empty = root.
// Read from env so dev and prod stay in sync. Defaults to "/grains".
export const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ?? "/grains";

/**
 * Resolve a public/static asset path for the current deployment base path.
 *   "/red_wheat.png"     -> "/grains/red_wheat.png"
 *   "./Images/arrow.svg" -> "/grains/Images/arrow.svg"
 *   "Images/foo.svg"     -> "/grains/Images/foo.svg"
 *   "./Images/foo.webp"  -> "/grains/Images/webpimages/foo.webp"
 * External URLs (http(s)://, protocol-relative //, data:) are returned untouched.
 */
export function asset(path) {
  if (!path) return null;
  if (/^([a-z]+:)?\/\//i.test(path) || path.startsWith("data:")) return path;

  const normalizedPath = path.replace(/^\.?\//, "");
  const webpProductPath = normalizedPath.replace(
    /^Images\/(?!webpimages\/)(.+\.webp(?:[?#].*)?)$/i,
    "Images/webpimages/$1"
  );

  return `${BASE_PATH}/${webpProductPath}`;
}
