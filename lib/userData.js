import { getToken } from "./authenticate";

export async function getFavourites() {
  const res = await fetch(`/api/favourites`, {
    headers: { Authorization: "JWT " + getToken() },
  });
  if (res.status === 200) {
    try {
      return await res.json();
    } catch (err) {
      return [];
    }
  }
  return [];
}

export async function addToFavourites(id) {
  const res = await fetch(`/api/favourites/${id}`, {
    method: "PUT",
    headers: { Authorization: "JWT " + getToken() },
  });
  if (res.status === 200) {
    try {
      return await res.json();
    } catch (err) {
      return [];
    }
  }
  return [];
}

export async function removeFromFavourites(id) {
  const res = await fetch(`/api/favourites/${id}`, {
    method: "DELETE",
    headers: { Authorization: "JWT " + getToken() },
  });
  if (res.status === 200) {
    try {
      return await res.json();
    } catch (err) {
      return [];
    }
  }
  return [];
}
