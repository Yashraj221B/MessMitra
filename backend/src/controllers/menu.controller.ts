import { Request, Response } from 'express';
import { MenuService } from '../services/menu.service';
import { successResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { CreateMenuDTO, UpdateMenuDTO } from '../types/menu.types';

const menuService = new MenuService();

export const createMenu = asyncHandler(async (req: Request, res: Response) => {
  const { messId } = req.params;
  const data: CreateMenuDTO = req.body;

  const menu = await menuService.createMenu(messId, data);
  res.status(201).json(successResponse('Menu created successfully', menu));
});

export const getMenuById = asyncHandler(async (req: Request, res: Response) => {
  const { menuId } = req.params;

  const menu = await menuService.getMenuById(menuId);
  res.json(successResponse('Menu retrieved successfully', menu));
});

export const getMenuByDate = asyncHandler(async (req: Request, res: Response) => {
  const { messId } = req.params;
  const { date } = req.query;

  const menu = await menuService.getMenuByDate(messId, date as string);
  res.json(successResponse('Menu retrieved successfully', menu));
});

export const getWeeklyMenu = asyncHandler(async (req: Request, res: Response) => {
  const { messId } = req.params;
  const { startDate } = req.query;

  const menus = await menuService.getWeeklyMenu(messId, startDate as string);
  res.json(successResponse('Weekly menu retrieved successfully', menus));
});

export const getMonthlyMenu = asyncHandler(async (req: Request, res: Response) => {
  const { messId } = req.params;
  const { year, month } = req.query;

  const menus = await menuService.getMonthlyMenu(
    messId,
    parseInt(year as string),
    parseInt(month as string)
  );
  res.json(successResponse('Monthly menu retrieved successfully', menus));
});

export const updateMenu = asyncHandler(async (req: Request, res: Response) => {
  const { menuId } = req.params;
  const data: UpdateMenuDTO = req.body;

  const menu = await menuService.updateMenu(menuId, data);
  res.json(successResponse('Menu updated successfully', menu));
});

export const deleteMenu = asyncHandler(async (req: Request, res: Response) => {
  const { menuId } = req.params;

  await menuService.deleteMenu(menuId);
  res.json(successResponse('Menu deleted successfully', null));
});
