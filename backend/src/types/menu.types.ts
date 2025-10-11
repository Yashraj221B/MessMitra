export interface MealItem {
  items: string[];
  time?: string;
  imageUrl?: string;
  calories?: number;
  isSpecial?: boolean;
}

export interface CreateMenuDTO {
  messId: string;
  date: string; // YYYY-MM-DD
  meals: {
    breakfast?: MealItem;
    lunch?: MealItem;
    dinner?: MealItem;
  };
  isHoliday?: boolean;
  holidayName?: string;
  allergyWarnings?: string[];
}

export interface UpdateMenuDTO extends Partial<CreateMenuDTO> {}

export interface MenuResponse {
  id: string;
  messId: string;
  date: string;
  meals: any;
  isHoliday: boolean;
  holidayName?: string;
  allergyWarnings?: string[];
  version: number;
  createdBy?: string;
  lastModifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
