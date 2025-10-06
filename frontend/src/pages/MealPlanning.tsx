import { useState } from 'react';
import { Calendar, Plus, Edit2, Trash2, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Dialog, ConfirmDialog } from '../components/common';
import { useToast } from '../contexts/ToastContext';
import type { MenuItem } from '../types';
import { mockMenu } from '../data/mockData';

type MealType = 'breakfast' | 'lunch' | 'dinner';

// Dialog components defined OUTSIDE to prevent recreation
interface MealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    mealType: MealType;
    items: string;
    description: string;
  };
  onFormChange: (data: { mealType?: MealType; items?: string; description?: string }) => void;
  onSubmit: () => void;
  title: string;
  submitText: string;
  showMealTypeSelector?: boolean;
}

const MealDialog = ({ isOpen, onClose, formData, onFormChange, onSubmit, title, submitText, showMealTypeSelector = false }: MealDialogProps) => {
  if (!isOpen) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-5">
        {showMealTypeSelector && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Meal Type
            </label>
            <select
              value={formData.mealType}
              onChange={(e) => onFormChange({ mealType: e.target.value as MealType })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-slate-800"
            >
              <option value="breakfast">🌅 Breakfast</option>
              <option value="lunch">☀️ Lunch</option>
              <option value="dinner">🌙 Dinner</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Menu Items (one per line)
          </label>
          <textarea
            value={formData.items}
            onChange={(e) => onFormChange({ items: e.target.value })}
            placeholder="Dal Tadka&#10;Jeera Rice&#10;Roti&#10;Mix Veg"
            rows={6}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-slate-800"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Description (optional)
          </label>
          <Input
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange({ description: e.target.value })}
            placeholder="e.g., Wholesome lunch thali"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={onSubmit} className="w-full sm:w-auto">
            {submitText}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export const MealPlanning = () => {
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState<MenuItem[]>(mockMenu);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MenuItem | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<string | null>(null);

  // Separate state for Add dialog
  const [addFormData, setAddFormData] = useState({
    mealType: 'lunch' as MealType,
    items: '',
    description: '',
  });

  // Separate state for Edit dialog
  const [editFormData, setEditFormData] = useState({
    mealType: 'lunch' as MealType,
    items: '',
    description: '',
  });

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getTodaysMeals = () => {
    const dateStr = formatDate(selectedDate);
    return meals.filter(meal => meal.date === dateStr);
  };

  const getMealByType = (type: MealType) => {
    return getTodaysMeals().find(meal => meal.mealType === type);
  };

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleAddMeal = () => {
    if (!addFormData.items.trim()) {
      showToast('Please add menu items', 'error');
      return;
    }

    const itemsArray = addFormData.items.split('\n').filter(item => item.trim());
    const newMeal: MenuItem = {
      id: Date.now().toString(),
      mealType: addFormData.mealType,
      date: formatDate(selectedDate),
      items: itemsArray,
      description: addFormData.description,
    };

    setMeals([...meals, newMeal]);
    showToast(`${addFormData.mealType.charAt(0).toUpperCase() + addFormData.mealType.slice(1)} menu added!`, 'success');
    setIsAddDialogOpen(false);
    setAddFormData({ mealType: 'lunch', items: '', description: '' });
  };

  const handleEditMeal = () => {
    if (!editingMeal || !editFormData.items.trim()) {
      showToast('Please add menu items', 'error');
      return;
    }

    const itemsArray = editFormData.items.split('\n').filter(item => item.trim());
    const updatedMeals = meals.map(meal =>
      meal.id === editingMeal.id
        ? { ...meal, items: itemsArray, description: editFormData.description }
        : meal
    );

    setMeals(updatedMeals);
    showToast('Menu updated successfully!', 'success');
    setIsEditDialogOpen(false);
    setEditingMeal(null);
    setEditFormData({ mealType: 'lunch', items: '', description: '' });
  };

  const handleDeleteMeal = (mealId: string) => {
    setMealToDelete(mealId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (mealToDelete) {
      setMeals(meals.filter(meal => meal.id !== mealToDelete));
      showToast('Menu deleted successfully', 'success');
      setMealToDelete(null);
    }
  };

  const handleCopyFromPreviousDay = () => {
    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 1);
    const previousDateStr = formatDate(previousDate);
    
    const previousMeals = meals.filter(meal => meal.date === previousDateStr);
    
    if (previousMeals.length === 0) {
      showToast('No meals found for previous day', 'error');
      return;
    }

    const copiedMeals = previousMeals.map(meal => ({
      ...meal,
      id: Date.now().toString() + meal.mealType,
      date: formatDate(selectedDate),
    }));

    setMeals([...meals, ...copiedMeals]);
    showToast('Menu copied from previous day!', 'success');
  };

  const openEditDialog = (meal: MenuItem) => {
    setEditingMeal(meal);
    setEditFormData({
      mealType: meal.mealType,
      items: meal.items.join('\n'),
      description: meal.description || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleAddFormChange = (updates: { mealType?: MealType; items?: string; description?: string }) => {
    setAddFormData(prev => ({ ...prev, ...updates }));
  };

  const handleEditFormChange = (updates: { mealType?: MealType; items?: string; description?: string }) => {
    setEditFormData(prev => ({ ...prev, ...updates }));
  };

  const renderMealCard = (type: MealType, title: string, icon: string) => {
    const meal = getMealByType(type);

    return (
      <Card className="h-full bg-white rounded-2xl shadow-lg border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          </div>
          {meal && (
            <div className="flex gap-2">
              <button
                onClick={() => openEditDialog(meal)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteMeal(meal.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {meal ? (
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Menu Items:</h4>
              <div className="flex flex-wrap gap-2">
                {meal.items.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700 text-sm font-medium rounded-full border border-primary-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            {meal.description && (
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-sm text-slate-700 italic">"{meal.description}"</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm mb-4">No menu set</p>
            <Button
              size="sm"
              onClick={() => {
                setAddFormData({ mealType: type, items: '', description: '' });
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Menu
            </Button>
          </div>
        )}
      </Card>
    );
  };



  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 pt-8 pb-20 rounded-b-3xl shadow-xl">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-2 text-white">Meal Planning</h1>
          <p className="text-white text-sm">Plan and manage daily menu for your mess</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 -mt-12 pb-8 space-y-4 animate-fade-in">
        {/* Date Navigator */}
        <Card className="bg-white rounded-2xl shadow-lg border border-slate-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button variant="outline" onClick={() => handleDateChange(-1)} size="sm" className="w-full sm:w-auto">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous Day</span>
              <span className="sm:hidden">Previous</span>
            </Button>

            <div className="flex items-center gap-3 text-center">
              <Calendar className="h-5 w-5 text-primary-600 hidden sm:block" />
              <div>
                <p className="text-base sm:text-lg font-bold text-slate-800">
                  {selectedDate.toLocaleDateString('en-IN', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                {selectedDate.toDateString() === new Date().toDateString() && (
                  <p className="text-xs text-primary-600 font-semibold">Today</p>
                )}
              </div>
            </div>

            <Button variant="outline" onClick={() => handleDateChange(1)} size="sm" className="w-full sm:w-auto">
              <span className="hidden sm:inline">Next Day</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-slate-200">
            <Button variant="outline" size="sm" onClick={handleCopyFromPreviousDay} className="w-full sm:w-auto">
              <Copy className="h-4 w-4" />
              Copy from Previous Day
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())} className="w-full sm:w-auto">
              <Calendar className="h-4 w-4" />
              Go to Today
            </Button>
          </div>
        </Card>

        {/* Meal Cards */}
        <div className="grid grid-cols-1 gap-4">
          {renderMealCard('breakfast', 'Breakfast', '🌅')}
          {renderMealCard('lunch', 'Lunch', '☀️')}
          {renderMealCard('dinner', 'Dinner', '🌙')}
        </div>
      </div>

      {/* Dialogs */}
      <MealDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setAddFormData({ mealType: 'lunch', items: '', description: '' });
        }}
        formData={addFormData}
        onFormChange={handleAddFormChange}
        onSubmit={handleAddMeal}
        title="Add Menu"
        submitText="Add Menu"
        showMealTypeSelector
      />
      <MealDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingMeal(null);
          setEditFormData({ mealType: 'lunch', items: '', description: '' });
        }}
        formData={editFormData}
        onFormChange={handleEditFormChange}
        onSubmit={handleEditMeal}
        title="Edit Menu"
        submitText="Update Menu"
      />
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Menu"
        message="Are you sure you want to delete this menu? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};
