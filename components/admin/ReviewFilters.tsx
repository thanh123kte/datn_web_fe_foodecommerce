"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ReviewFiltersProps {
  stores: Array<{ id: number; name: string }>;
  selectedStore: string;
  selectedRating: string;
  hasImage: string;
  searchTerm: string;
  onStoreChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onImageFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function ReviewFilters({
  stores,
  selectedStore,
  selectedRating,
  hasImage,
  searchTerm,
  onStoreChange,
  onRatingChange,
  onImageFilterChange,
  onSearchChange,
}: ReviewFiltersProps) {
  const [storeSearchTerm, setStoreSearchTerm] = useState("");
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedStoreName =
    stores.find((s) => s.id.toString() === selectedStore)?.name ||
    "Tất cả cửa hàng";

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(storeSearchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsStoreDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStoreSelect = (storeId: string) => {
    onStoreChange(storeId);
    setIsStoreDropdownOpen(false);
    setStoreSearchTerm("");
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên khách hàng hoặc bình luận..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Store Search Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[200px] flex items-center justify-between"
          >
            <span className="truncate">{selectedStoreName}</span>
            <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
          </button>

          {isStoreDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm cửa hàng..."
                    value={storeSearchTerm}
                    onChange={(e) => setStoreSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => handleStoreSelect("")}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                >
                  Tất cả cửa hàng
                </button>
                {filteredStores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => handleStoreSelect(store.id.toString())}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  >
                    {store.name}
                  </button>
                ))}
                {filteredStores.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Không tìm thấy cửa hàng
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <select
          value={selectedRating}
          onChange={(e) => onRatingChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả số sao</option>
          <option value="5">5 sao ⭐⭐⭐⭐⭐</option>
          <option value="4">4 sao ⭐⭐⭐⭐</option>
          <option value="3">3 sao ⭐⭐⭐</option>
          <option value="2">2 sao ⭐⭐</option>
          <option value="1">1 sao ⭐</option>
        </select>

        <select
          value={hasImage}
          onChange={(e) => onImageFilterChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả</option>
          <option value="true">Có hình ảnh</option>
          <option value="false">Không có hình ảnh</option>
        </select>
      </div>
    </div>
  );
}
