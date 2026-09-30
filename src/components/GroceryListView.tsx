import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Check, 
  Plus, 
  Trash2, 
  Copy, 
  Leaf, 
  Wheat, 
  Egg, 
  Nut, 
  CheckCheck 
} from 'lucide-react';
import type { DietPlan, GroceryItem } from '../types/index.ts';

interface GroceryListViewProps {
  activePlan: DietPlan | null;
  onOpenGenerator: () => void;
}

export const GroceryListView: React.FC<GroceryListViewProps> = ({ activePlan, onOpenGenerator }) => {
  // Generate initial grocery items from active plan
  const initialItems: GroceryItem[] = [
    { id: '1', name: 'Fresh baby spinach & organic arugula (250g)', aisle: 'Fresh Produce', checked: true },
    { id: '2', name: 'Ripe Hass Avocados (3 count)', aisle: 'Fresh Produce', checked: true },
    { id: '3', name: 'Fresh organic blueberries & raspberries', aisle: 'Fresh Produce', checked: false },
    { id: '4', name: 'Persian cucumbers & vine cherry tomatoes', aisle: 'Fresh Produce', checked: false },
    { id: '5', name: 'Fresh lemons & limes (4 count)', aisle: 'Fresh Produce', checked: false },
    
    { id: '6', name: 'Organic rolled oats (500g bag)', aisle: 'Grains & Pantry', checked: true },
    { id: '7', name: 'Tri-color organic quinoa (400g)', aisle: 'Grains & Pantry', checked: false },
    { id: '8', name: 'Aged brown basmati rice', aisle: 'Grains & Pantry', checked: false },
    { id: '9', name: 'Cold-pressed extra virgin olive oil', aisle: 'Grains & Pantry', checked: true },

    { id: '10', name: 'Organic firm tofu or paneer (400g)', aisle: 'Proteins & Dairy', checked: false },
    { id: '11', name: 'Authentic plain Greek yogurt (500g)', aisle: 'Proteins & Dairy', checked: false },
    { id: '12', name: 'Yellow split moong dal or red lentils', aisle: 'Proteins & Dairy', checked: false },
    { id: '13', name: 'Wild Alaskan salmon fillets or pasture eggs', aisle: 'Proteins & Dairy', checked: false },

    { id: '14', name: 'Raw almonds & raw pumpkin seeds', aisle: 'Superfoods & Nuts', checked: false },
    { id: '15', name: 'Organic black chia seeds', aisle: 'Superfoods & Nuts', checked: false },
    { id: '16', name: 'Raw wildflower honey or maple syrup', aisle: 'Superfoods & Nuts', checked: true }
  ];

  const [items, setItems] = useState<GroceryItem[]>(initialItems);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAisle, setNewItemAisle] = useState<GroceryItem['aisle']>('Fresh Produce');
  const [copied, setCopied] = useState(false);

  const toggleCheck = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: GroceryItem = {
      id: 'custom_' + Date.now(),
      name: newItemName.trim(),
      aisle: newItemAisle,
      checked: false
    };

    setItems(prev => [...prev, newItem]);
    setNewItemName('');
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const checkedCount = items.filter(i => i.checked).length;
  const progressPercent = Math.round((checkedCount / (items.length || 1)) * 100);

  const handleCopyList = () => {
    const text = items
      .map(i => `${i.checked ? '✓' : '○'} [${i.aisle}] ${i.name}`)
      .join('\n');
    navigator.clipboard.writeText(`🥗 DietCloud Grocery Shopping List:\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearChecked = () => {
    setItems(prev => prev.filter(i => !i.checked));
  };

  // 4 rich distinct aisle color schemes
  const aisles: { title: GroceryItem['aisle']; icon: any; color: string; bg: string; border: string; checkColor: string }[] = [
    { 
      title: 'Fresh Produce', 
      icon: Leaf, 
      color: 'text-emerald-800', 
      bg: 'bg-emerald-100', 
      border: 'border-emerald-200',
      checkColor: 'bg-emerald-600 border-emerald-600'
    },
    { 
      title: 'Grains & Pantry', 
      icon: Wheat, 
      color: 'text-amber-800', 
      bg: 'bg-amber-100', 
      border: 'border-amber-200',
      checkColor: 'bg-amber-500 border-amber-500'
    },
    { 
      title: 'Proteins & Dairy', 
      icon: Egg, 
      color: 'text-rose-800', 
      bg: 'bg-rose-100', 
      border: 'border-rose-200',
      checkColor: 'bg-rose-600 border-rose-600'
    },
    { 
      title: 'Superfoods & Nuts', 
      icon: Nut, 
      color: 'text-pink-800', 
      bg: 'bg-pink-100', 
      border: 'border-pink-200',
      checkColor: 'bg-pink-600 border-pink-600'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header with vibrant organic gradient */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 p-6 sm:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold font-mono uppercase tracking-wider mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              Smart Grocery & Pantry Checklist
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Organized Shopping List 🥦
            </h1>
            <p className="text-xs sm:text-sm text-emerald-50 mt-1 max-w-xl">
              Ingredients automatically aggregated by supermarket aisles to make whole-food shopping fast and effortless.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyList}
              className="bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
            >
              {copied ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-emerald-600" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Shopping List'}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span>
            Progress: <strong className="text-white">{checkedCount} of {items.length} items checked</strong> ({progressPercent}%)
          </span>
          <div className="h-2.5 w-full sm:w-64 bg-black/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-300 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Custom Item Bar */}
      <form onSubmit={handleAddItem} className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add custom item (e.g. cold-brew coffee, organic walnuts)..."
          className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-emerald-500 w-full"
        />

        <select
          value={newItemAisle}
          onChange={(e) => setNewItemAisle(e.target.value as any)}
          className="bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2.5 text-xs font-bold text-stone-700 focus:outline-none focus:border-emerald-500 w-full sm:w-auto"
        >
          <option value="Fresh Produce">🥦 Fresh Produce</option>
          <option value="Grains & Pantry">🌾 Grains & Pantry</option>
          <option value="Proteins & Dairy">🥚 Proteins & Dairy</option>
          <option value="Superfoods & Nuts">🥑 Superfoods & Nuts</option>
        </select>

        <button
          type="submit"
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all w-full sm:w-auto shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </form>

      {/* Grocery Items Grouped by Aisles with distinctive colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {aisles.map(({ title, icon: Icon, color, bg, border, checkColor }) => {
          const aisleItems = items.filter(i => i.aisle === title);
          if (aisleItems.length === 0) return null;

          return (
            <div key={title} className={`bg-white rounded-3xl p-5 border ${border} shadow-xs space-y-3 flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${bg} ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-xs text-stone-800 uppercase tracking-wider font-mono">
                      {title}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-stone-400 font-mono">
                    {aisleItems.filter(i => i.checked).length}/{aisleItems.length}
                  </span>
                </div>

                <div className="divide-y divide-stone-50 mt-1">
                  {aisleItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className="py-2.5 flex items-center justify-between cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          item.checked 
                            ? `${checkColor} text-white` 
                            : 'border-stone-300 group-hover:border-emerald-500'
                        }`}>
                          {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </span>
                        <span className={`text-xs ${item.checked ? 'line-through text-stone-400' : 'text-stone-800 font-medium'}`}>
                          {item.name}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-300 hover:text-rose-600 transition-opacity"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clear Checked Button */}
      {checkedCount > 0 && (
        <div className="flex justify-end">
          <button
            onClick={clearChecked}
            className="text-xs font-bold text-stone-500 hover:text-rose-600 px-4 py-2 rounded-2xl hover:bg-rose-50 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Completed Items ({checkedCount})
          </button>
        </div>
      )}
    </div>
  );
};
