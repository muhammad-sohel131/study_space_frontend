import React, { useState } from 'react';

interface TabItem {
 label: string;
 value: string;
 content: React.ReactNode;
 icon?: React.ReactNode;
}

interface TabsProps {
 items: TabItem[];
 defaultValue?: string;
 onChange?: (value: string) => void;
}

export function Tabs({ items, defaultValue, onChange }: TabsProps) {
 const [activeTab, setActiveTab] = useState(defaultValue || items[0]?.value || '');

 const handleTabChange = (value: string) => {
 setActiveTab(value);
 onChange?.(value);
 };

 const activeContent = items.find((item) => item.value === activeTab)?.content;

 return (
 <div className="space-y-4">
 <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
 {items.map((item) => (
 <button
 key={item.value}
 onClick={() => handleTabChange(item.value)}
 className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
 activeTab === item.value
 ? 'bg-white text-violet-600 shadow-sm'
 : 'text-slate-600 hover:text-slate-900 '
 }`}
 >
 {item.icon && <span>{item.icon}</span>}
 {item.label}
 </button>
 ))}
 </div>
 <div className="mt-4">{activeContent}</div>
 </div>
 );
}
