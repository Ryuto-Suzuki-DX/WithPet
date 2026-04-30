export type PetEventItem = {
  id: number;
  itemName: string;
  amount: number;
  unit: "g" | "cc";
};

export type PetEvent = {
  id: number;
  petId: number;
  eventType: string;
  title: string;
  eventAt: string;
  nextEventAt?: string | null;
  memo: string;
  imageKey: string;
  remindEnabled: boolean;
  remindAt?: string | null;
  items: PetEventItem[];
};

export type CreatePetEventItemRequest = {
  itemName: string;
  amount: number;
  unit: "g" | "cc";
};

export type CreatePetEventRequest = {
  eventType: string;
  title: string;
  eventAt: string;
  nextEventAt?: string | null;
  memo: string;
  imageKey: string;
  remindEnabled: boolean;
  remindAt?: string | null;
  items: CreatePetEventItemRequest[];
};

export type UpdatePetEventRequest = CreatePetEventRequest;