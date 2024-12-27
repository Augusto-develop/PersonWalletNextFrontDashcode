'use client';
import fetchWithAuth from "./login-actions";
import { CategoryDto } from "./types.schema.dto";
import { Category, CategoryOption } from "@/lib/model/types";

export const getCategories = async (): Promise<Category[]> => {

    const res = await fetchWithAuth("/categoria", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: Category[] = [];

    if (res.ok) {
        const data: CategoryDto[] = await res.json();

        newData = data.map((item) => (convertDtoToCategory(item)));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};

export const createCategory = async (payload: CategoryDto): Promise<CategoryDto | undefined> => {
    delete payload.id;

    const res = await fetchWithAuth("/categoria", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newCategoryDto: CategoryDto = await res.json();
        return newCategoryDto;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const editCategory = async (payload: CategoryDto): Promise<CategoryDto | undefined> => {
    const res = await fetchWithAuth("/categoria/" + payload.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newCategoryDto: CategoryDto = await res.json();
        return newCategoryDto;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const deleteCategory = async (id: string): Promise<Response> => {
    const res = await fetchWithAuth(`/categoria/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res;
};

export function convertDtoToCategory(categoryDto: CategoryDto): Category {
    return {
        id: categoryDto.id ?? '',
        description: categoryDto.descricao
    };
}

export const createOptionsCategories = async (): Promise<CategoryOption[]> => {

    const categories: Category[] = await getCategories();

    const categoriaOptions: CategoryOption[] = categories.map((item) => ({
        label: item.description,
        value: item.id
    })) as CategoryOption[];

    return categoriaOptions;
}