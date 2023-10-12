import { FormPerson, PaginateType, Person } from "@/models";
import http from "@/utils/http";

export async function fetchPersons(organizationId: string, perPage: number, page: number) {
  try {
    const res = await http.get<PaginateType<Person>>(`/persons/${organizationId}/table`, {
      params: {
        page, per_page: perPage
      }
    })
    return res.data;
  } catch (error) {
    console.error(error)
    return null;
  }
}

export async function fetchPerson(id: string) {
  try {
    const res = await http.get<Person>("/persons/"+id);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createPerson(forms: FormPerson) {
  try {
    const formData = new FormData();
    formData.append('organization_id', forms.organization_id)
    formData.append('name', forms.name)
    formData.append('phone', forms.phone)
    formData.append('email', forms.email)
    if (forms.avatar){
      formData.append('avatar', forms.avatar)
    }
    
    const res = await http.post<Person>("/persons", formData)
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updatePerson(forms: FormPerson, id: string) {
  try {
    const formData = new FormData();
    formData.append('organization_id', forms.organization_id)
    formData.append('name', forms.name)
    formData.append('phone', forms.phone)
    formData.append('email', forms.email)
    if (forms.avatar){
      formData.append('avatar', forms.avatar)
    }
    
    const res = await http.post<Person>("/persons/"+id+"/update", formData)
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deletePerson(id: string) {
  try {
    await http.delete('/persons/'+id);
    return true;
  } catch (error) {
    return false;
  }
}
