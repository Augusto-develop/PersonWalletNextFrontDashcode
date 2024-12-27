"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import { convertDtoToCategory, createCategory, editCategory } from "@/action/category-actions";
import { useCategoryContext } from "./category-context";
import { CategoryDto } from "@/action/types.schema.dto";
import { Category } from "@/lib/model/types";

interface CreateTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataCategory?: Category | null
}

type Inputs = {
  id?: string;
  description: string;  
}

const submitCreate = async (data: {
  id?: string | null;
  description: any;  
}): Promise<CategoryDto | undefined> => {

  // Prepara o payload
  const payload: CategoryDto = {
    id: data.id ?? "",
    descricao: data.description    
  };

  try {
    return payload.id?.trim() !== "" ?
      editCategory(payload) :
      createCategory(payload);
  } catch (error) {
    console.error("Erro de requisição:", error);
  }
};

const CreateCategory = ({ open, setOpen, dataCategory = null }: CreateTaskProps) => {

  const { categories, setCategories, editCategory } = useCategoryContext();  

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {

    data.id = dataCategory?.id ?? undefined;

    const categoryDto: CategoryDto | undefined = await submitCreate(data);
    if (categoryDto) {
      const row: Category = convertDtoToCategory(categoryDto);
      data.id ?
        editCategory(data.id, row) :
        setCategories((prevRows) => [...prevRows, row]);
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-1">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Description Category"
              {...register("description", { required: "Descrição is required." })}
              color={errors.description ? "destructive" : "default"}
              defaultValue={dataCategory?.description || ""}
            />
            {errors.description &&
              <p className="text-destructive  text-sm font-medium">{errors.description.message}</p>}
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>

      </DialogContent>
    </Dialog >
  );
};

export default CreateCategory;
