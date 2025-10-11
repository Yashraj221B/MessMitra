import { api } from './api.service';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface Menu {
  id: string;
  messId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  items: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuByDate {
  date: string;
  breakfast?: string;
  lunch?: string;
  dinner?: string;
}

class MenuService {
  /**
   * Create a new menu for a specific meal
   */
  async createMenu(data: {
    messId: string;
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner';
    items: string;
    description?: string;
  }): Promise<Menu> {
    const response = await api.post(API_ENDPOINTS.MENU.CREATE(data.messId), data);
    return response.data.data;
  }

  /**
   * Get menu for a specific date
   */
  async getMenuByDate(messId: string, date: string): Promise<MenuByDate> {
    const response = await api.get(API_ENDPOINTS.MENU.GET_BY_DATE(messId), {
      params: { date }
    });
    
    // Transform array of menus into a single object
    const menus = response.data.data || [];
    const menuByMeal: MenuByDate = { date };
    
    menus.forEach((menu: Menu) => {
      menuByMeal[menu.mealType] = menu.items;
    });
    
    return menuByMeal;
  }

  /**
   * Get weekly menu (7 days from specified start date)
   */
  async getWeeklyMenu(messId: string, startDate?: string): Promise<MenuByDate[]> {
    const response = await api.get(API_ENDPOINTS.MENU.GET_WEEKLY(messId), {
      params: { startDate: startDate || new Date().toISOString().split('T')[0] }
    });
    return response.data.data || [];
  }

  /**
   * Get monthly menu
   */
  async getMonthlyMenu(messId: string, month: number, year: number): Promise<MenuByDate[]> {
    const response = await api.get(API_ENDPOINTS.MENU.GET_MONTHLY(messId), {
      params: { month, year }
    });
    return response.data.data || [];
  }

  /**
   * Update an existing menu
   */
  async updateMenu(
    menuId: string,
    data: {
      items?: string;
      description?: string;
    }
  ): Promise<Menu> {
    const response = await api.put(API_ENDPOINTS.MENU.UPDATE(menuId), data);
    return response.data.data;
  }

  /**
   * Delete a menu
   */
  async deleteMenu(menuId: string): Promise<void> {
    await api.delete(API_ENDPOINTS.MENU.DELETE(menuId));
  }

  /**
   * Bulk create/update menu for a full day (all 3 meals)
   */
  async setDayMenu(
    messId: string,
    date: string,
    menus: {
      breakfast?: string;
      lunch?: string;
      dinner?: string;
    }
  ): Promise<Menu[]> {
    const promises: Promise<Menu>[] = [];
    
    if (menus.breakfast) {
      promises.push(
        this.createMenu({
          messId,
          date,
          mealType: 'breakfast',
          items: menus.breakfast
        })
      );
    }
    
    if (menus.lunch) {
      promises.push(
        this.createMenu({
          messId,
          date,
          mealType: 'lunch',
          items: menus.lunch
        })
      );
    }
    
    if (menus.dinner) {
      promises.push(
        this.createMenu({
          messId,
          date,
          mealType: 'dinner',
          items: menus.dinner
        })
      );
    }
    
    return Promise.all(promises);
  }
}

export const menuService = new MenuService();
