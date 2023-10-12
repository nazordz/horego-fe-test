import { FormUser, PaginateType, User } from "@/models";
import http from "@/utils/http";

export async function fetchUsers(page: number, perPage: number) {
  try {
    const res = await http.get<PaginateType<User>>("/users", {
      params: {
        page,
        per_page: perPage,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchUser(id: string) {
  try {
    const res = await http.get<User>("/users/" + id);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createUser(forms: FormUser) {
  try {
    const res = await http.post<User>("/users", forms)
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateUser(forms: FormUser, id: string) {
  try {
    const res = await http.put<User>("/users/"+id, forms)
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteUser(id:string) {
  try {
    await http.delete("/users/"+id)
    return true;
  } catch (error) {
    console.error(error)
    return false;
  }
}