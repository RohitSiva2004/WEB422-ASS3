import { getToken } from "./authenticate";

export async function getFavourites() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites`, {
    headers: { Authorization: "JWT " + getToken() },
  });
  return res.status === 200 ? await res.json() : [];
}

export async function addToFavourites(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, {
    method: "PUT",
    headers: { Authorization: "JWT " + getToken() },
  });
  return res.status === 200 ? await res.json() : [];
}

export async function removeFromFavourites(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, {
    method: "DELETE",
    headers: { Authorization: "JWT " + getToken() },
  });
  return res.status === 200 ? await res.json() : [];
}
