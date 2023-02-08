export interface Category {
  id: string,
  name: string,
  parentCategoryId?: string
}

export interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
  idsForFilter: string[];
}
