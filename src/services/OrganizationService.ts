import { FormOrganization, Organization, PaginateType } from "@/models";
import http from "@/utils/http";

export async function fetchOrganization(id: string) {
  try {
    const res = await http.get<Organization>(`/organizations/${id}`);
    return res.data;
  } catch (error) {
    console.error(error)
    return null;
  }
}

export async function fetchOrganizations(page: number, perPage: number, search: string) {
  try {
    const result = await http.get<PaginateType<Organization>>('/organizations', {
      params: {
        page,
        per_page: perPage,
        search: search
      }
    });
    return result.data;
  } catch (error) {
    console.error(error)
    return null;
  }
}

export async function createOrganization(forms: FormOrganization) {
  try {
    const formData = new FormData();
    formData.append('name', forms.name)
    formData.append('phone', forms.phone);
    formData.append('email', forms.email);
    formData.append('website', forms.website);
    formData.append('logo', forms.logo!);
    const res = await http.post<Organization>('/organizations/', formData)
    return res.data;
  } catch (error) {
    console.error(error)
    return null;
  }
}
export async function updateOrganization(forms: FormOrganization, id: string) {
  try {
    const formData = new FormData();
    formData.append('name', forms.name)
    formData.append('phone', forms.phone);
    formData.append('email', forms.email);
    formData.append('website', forms.website);
    if (forms.logo) {
      formData.append('logo', forms.logo);
    }
    const res = await http.post<Organization>('/organizations/'+id+'/update', formData)
    return res.data;
  } catch (error) {
    console.error(error)
    return null;
  }
}

export async function deleteOrganization(id: string) {
  try {
    await http.delete("/organizations/"+id);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}