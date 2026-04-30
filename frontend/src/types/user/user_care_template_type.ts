export type CareTemplateType = "FOOD" | "SNACK" | "MEDICINE";

export type CareTemplateUnit = "g" | "cc";

export type CareTemplateItem = {
  id: number;
  itemName: string;
  amount: number;
  unit: CareTemplateUnit;
};

export type CareTemplate = {
  id: number;
  petId: number;
  templateType: CareTemplateType;
  name: string;
  imageKey: string;
  imageUrl: string;
  items: CareTemplateItem[];
  isFixed: boolean;
  fixedDaysOfWeek: string[];
  fixedTime: string;
  memo: string;
};

export type CreateCareTemplateItemRequest = {
  itemName: string;
  amount: number;
  unit: CareTemplateUnit;
};

export type CreateCareTemplateRequest = {
  templateType: CareTemplateType;
  name: string;
  imageKey: string;
  items: CreateCareTemplateItemRequest[];
  isFixed: boolean;
  fixedDaysOfWeek: string[];
  fixedTime: string;
  memo: string;
};

export type UpdateCareTemplateRequest = CreateCareTemplateRequest;