export default interface ComplementaryTaskCategoryDTO {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface CreateComplementaryTaskCategoryDTO {
  code: string;
  name: string;
  description: string;
}

export interface UpdateComplementaryTaskCategoryDTO {
  code?: string;
  name?: string;
  description?: string;
}