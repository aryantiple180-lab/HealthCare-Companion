import React, { useState } from 'react';
import { ShoppingCart, Search, Upload, Plus, Minus, Trash2, CheckCircle } from 'lucide-react';
import { Card, Button, Input } from './UI';

export const OrderMedicines: React.FC<{ t: any }> = ({ t }) => {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const medicines = [
    { id: 1, name: 'Paracetamol 500mg', price: 50, description: 'Pain relief and fever' },
    { id: 2, name: 'Amoxicillin 250mg', price: 120, description: 'Antibiotic' },
    { id: 3, name: 'Cough Syrup', price: 85, description: 'Relief from dry cough' },
    { id: 4, name: 'Vitamin C Tablets', price: 150, description: 'Immunity booster' },
    { id: 5, name: 'Omeprazole 20mg', price: 95, description: 'Acidity and heartburn' },
  ];

  const addToCart = (med: any) => {
    const existing = cart.find(item => item.id === med.id);
    if (existing) {
      setCart(cart.map(item => item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...med, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Order Placed!</h2>
        <p className="text-gray-500">Your medicines will be delivered soon.</p>
        <Button onClick={() => { setOrderPlaced(false); setCart([]); }}>Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{t.orderMedicines}</h2>
        <button onClick={() => setShowCart(!showCart)} className="relative p-2 bg-white rounded-full shadow-sm">
          <ShoppingCart className="w-6 h-6 text-emerald-500" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {showCart ? (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-700">Your Cart</h3>
          {cart.length === 0 ? (
            <p className="text-center py-10 text-gray-400">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map(item => (
                  <Card key={item.id} className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-xs text-gray-500">₹{item.price} per unit</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, -1)}><Minus className="w-4 h-4" /></button>
                        <span className="font-medium w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}><Plus className="w-4 h-4" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </Card>
                ))}
              </div>
              <Card className="bg-emerald-50 border-emerald-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-700">Total Amount</span>
                  <span className="text-xl font-bold text-emerald-600">₹{total}</span>
                </div>
                <Button fullWidth onClick={() => setOrderPlaced(true)}>Checkout & Pay</Button>
              </Card>
              <Button fullWidth variant="outline" onClick={() => setShowCart(false)}>Continue Shopping</Button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="relative">
            <Input 
              placeholder="Search medicines..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          <Card className="bg-blue-50 border-blue-100 flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-blue-800 text-sm">Upload Prescription</h4>
                <p className="text-[10px] text-blue-600">Get medicines faster with prescription</p>
              </div>
            </div>
            <Button size="sm" variant="secondary">Upload</Button>
          </Card>

          <div className="grid grid-cols-1 gap-3">
            {medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase())).map(med => (
              <Card key={med.id} className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-800">{med.name}</h4>
                  <p className="text-xs text-gray-500">{med.description}</p>
                  <p className="text-sm font-bold text-emerald-600 mt-1">₹{med.price}</p>
                </div>
                <Button size="sm" onClick={() => addToCart(med)}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
