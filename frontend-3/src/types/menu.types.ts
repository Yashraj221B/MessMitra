// Menu and meal-related type definitions

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface MenuItem {
  date: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface MealDetails {
  type: MealType;
  items: string;
  description?: string;
  time?: string;
}

export interface WeeklyMenu {
  [date: string]: MenuItem;
}
