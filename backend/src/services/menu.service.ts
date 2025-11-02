import prisma from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { CreateMenuDTO, UpdateMenuDTO, MenuResponse } from '../types/menu.types';

export class MenuService {

  async createMenu(messId: string, data: CreateMenuDTO): Promise<any> {
    // Verify mess exists
  const mess = await prisma.messes.findFirst({ where: { id: messId, is_active: true } });
    if (!mess) {
      throw new AppError('Mess not found', 404);
    }

    // Check if menu already exists for this date
    const existingMenu = await prisma.menus.findFirst({
      where: { mess_id: messId, date: new Date(data.date) }
    });
    if (existingMenu) {
      throw new AppError('Menu already exists for this date', 400);
    }

    const menu = await prisma.menus.create({
      data: {
        mess_id: messId,
        date: new Date(data.date),
        breakfast_items: data.meals?.breakfast as any || [],
        lunch_items: data.meals?.lunch as any || [],
        dinner_items: data.meals?.dinner as any || [],
        is_holiday: data.isHoliday || false
      }
    });

    return {
      id: menu.id,
      messId: menu.mess_id,
      date: menu.date.toISOString().split('T')[0],
      meals: {
        breakfast: menu.breakfast_items,
        lunch: menu.lunch_items,
        dinner: menu.dinner_items
      },
      isHoliday: menu.is_holiday || false,
      version: 0,
      createdAt: menu.created_at || new Date(),
      updatedAt: menu.updated_at || new Date()
    };
  }

  async getMenuById(menuId: string): Promise<any> {
    const menu = await prisma.menus.findUnique({
      where: { id: menuId }
    });

    if (!menu) {
      throw new AppError('Menu not found', 404);
    }

    return {
      id: menu.id,
      messId: menu.mess_id,
      date: menu.date.toISOString().split('T')[0],
      meals: {
        breakfast: menu.breakfast_items,
        lunch: menu.lunch_items,
        dinner: menu.dinner_items
      },
      isHoliday: menu.is_holiday || false,
      version: 0,
      createdAt: menu.created_at || new Date(),
      updatedAt: menu.updated_at || new Date()
    };
  }

  async getMenuByDate(messId: string, date: string): Promise<any | null> {
    const menu = await prisma.menus.findFirst({
      where: { mess_id: messId, date: new Date(date) }
    });

    if (!menu) {
      return null;
    }

    return {
      id: menu.id,
      messId: menu.mess_id,
      date: menu.date.toISOString().split('T')[0],
      meals: {
        breakfast: menu.breakfast_items,
        lunch: menu.lunch_items,
        dinner: menu.dinner_items
      },
      isHoliday: menu.is_holiday || false,
      version: 0,
      createdAt: menu.created_at || new Date(),
      updatedAt: menu.updated_at || new Date()
    };
  }

  async getWeeklyMenu(messId: string, startDate: string): Promise<any[]> {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // 7 days total

    const menus = await prisma.menus.findMany({
      where: {
        mess_id: messId,
        date: {
          gte: start,
          lte: end
        }
      },
      orderBy: { date: 'asc' }
    });

    return menus.map((menu: any) => ({
      id: menu.id,
      messId: menu.mess_id,
      date: menu.date.toISOString().split('T')[0],
      meals: {
        breakfast: menu.breakfast_items,
        lunch: menu.lunch_items,
        dinner: menu.dinner_items
      },
      isHoliday: menu.is_holiday || false,
      version: 0,
      createdAt: menu.created_at || new Date(),
      updatedAt: menu.updated_at || new Date()
    }));
  }

  async updateMenu(menuId: string, data: UpdateMenuDTO): Promise<any> {
    const menu = await prisma.menus.findUnique({
      where: { id: menuId }
    });

    if (!menu) {
      throw new AppError('Menu not found', 404);
    }

    const updateData: any = {};
    if (data.meals?.breakfast) updateData.breakfast_items = data.meals.breakfast;
    if (data.meals?.lunch) updateData.lunch_items = data.meals.lunch;
    if (data.meals?.dinner) updateData.dinner_items = data.meals.dinner;
    if (data.isHoliday !== undefined) updateData.is_holiday = data.isHoliday;

    const updatedMenu = await prisma.menus.update({
      where: { id: menuId },
      data: updateData
    });

    return {
      id: updatedMenu.id,
      messId: updatedMenu.mess_id,
      date: updatedMenu.date.toISOString().split('T')[0],
      meals: {
        breakfast: updatedMenu.breakfast_items,
        lunch: updatedMenu.lunch_items,
        dinner: updatedMenu.dinner_items
      },
      isHoliday: updatedMenu.is_holiday || false,
      version: 0,
      createdAt: updatedMenu.created_at || new Date(),
      updatedAt: updatedMenu.updated_at || new Date()
    };
  }

  async deleteMenu(menuId: string): Promise<void> {
    const menu = await prisma.menus.findUnique({
      where: { id: menuId }
    });

    if (!menu) {
      throw new AppError('Menu not found', 404);
    }

    await prisma.menus.delete({
      where: { id: menuId }
    });
  }

  async getMonthlyMenu(messId: string, year: number, month: number): Promise<any[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const menus = await prisma.menus.findMany({
      where: {
        mess_id: messId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { date: 'asc' }
    });

    return menus.map((menu: any) => ({
      id: menu.id,
      messId: menu.mess_id,
      date: menu.date.toISOString().split('T')[0],
      meals: {
        breakfast: menu.breakfast_items,
        lunch: menu.lunch_items,
        dinner: menu.dinner_items
      },
      isHoliday: menu.is_holiday || false,
      version: 0,
      createdAt: menu.created_at || new Date(),
      updatedAt: menu.updated_at || new Date()
    }));
  }
}
