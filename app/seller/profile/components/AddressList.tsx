"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Address } from "@/lib/mockData/profile";
import { MapPin, Plus, Edit, Trash2, Check, X } from "lucide-react";

interface AddressListProps {
  addresses: Address[];
  onAdd: (address: Omit<Address, "id" | "created_at" | "updated_at">) => void;
  onUpdate: (addressId: string, address: Partial<Address>) => void;
  onDelete: (addressId: string) => void;
  loading?: boolean;
}

interface AddressFormData {
  address_line: string;
  city: string;
  district: string;
  ward: string;
  postal_code: string;
  is_default: boolean;
}

export function AddressList({
  addresses,
  onAdd,
  onUpdate,
  onDelete,
  loading = false,
}: AddressListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    address_line: "",
    city: "",
    district: "",
    ward: "",
    postal_code: "",
    is_default: false,
  });

  const resetForm = () => {
    setFormData({
      address_line: "",
      city: "",
      district: "",
      ward: "",
      postal_code: "",
      is_default: false,
    });
  };

  const handleAdd = () => {
    onAdd({
      user_id: "", // Will be set by the API
      address_line: formData.address_line,
      city: formData.city,
      district: formData.district,
      ward: formData.ward,
      postal_code: formData.postal_code,
      is_default: formData.is_default,
    });
    resetForm();
    setShowAddForm(false);
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      address_line: address.address_line,
      city: address.city,
      district: address.district,
      ward: address.ward,
      postal_code: address.postal_code || "",
      is_default: address.is_default,
    });
  };

  const handleUpdate = () => {
    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
      resetForm();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    resetForm();
  };

  const handleDelete = (addressId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      onDelete(addressId);
    }
  };

  const formatFullAddress = (address: Address) => {
    return [address.address_line, address.ward, address.district, address.city]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Delivery Addresses</h3>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          disabled={loading || showAddForm}
          className="flex items-center gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Add Address
        </Button>
      </div>

      <div className="space-y-4">
        {/* Add new address form */}
        {showAddForm && (
          <Card className="p-4 border-2 border-dashed border-blue-300 bg-blue-50">
            <h4 className="font-medium mb-4">Add New Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="addressLine">Street Address</Label>
                <Input
                  id="addressLine"
                  value={formData.address_line}
                  onChange={(e) =>
                    setFormData({ ...formData, address_line: e.target.value })
                  }
                  placeholder="House number, street name..."
                  disabled={loading}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">City/Province</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Hanoi, Ho Chi Minh City..."
                  disabled={loading}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  placeholder="District 1, Gia Lam District..."
                  disabled={loading}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ward">Ward</Label>
                <Input
                  id="ward"
                  value={formData.ward}
                  onChange={(e) =>
                    setFormData({ ...formData, ward: e.target.value })
                  }
                  placeholder="Tran Hung Dao Ward..."
                  disabled={loading}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postal_code}
                  onChange={(e) =>
                    setFormData({ ...formData, postal_code: e.target.value })
                  }
                  placeholder="100000"
                  disabled={loading}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.is_default}
                onChange={(e) =>
                  setFormData({ ...formData, is_default: e.target.checked })
                }
                disabled={loading}
                className="w-4 h-4 rounded border-gray-300"
              />
              <Label htmlFor="isDefault" className="text-sm">
                Set as default address
              </Label>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleAdd}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {loading ? "Saving..." : "Save Address"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Address list */}
        {addresses.map((address) => (
          <Card key={address.id} className="p-4">
            {editingId === address.id ? (
              // Edit form
              <div>
                <h4 className="font-medium mb-4">Edit Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor={`addressLine-${address.id}`}>
                      Street Address
                    </Label>
                    <Input
                      id={`addressLine-${address.id}`}
                      value={formData.address_line}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address_line: e.target.value,
                        })
                      }
                      disabled={loading}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`city-${address.id}`}>City/Province</Label>
                    <Input
                      id={`city-${address.id}`}
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      disabled={loading}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`district-${address.id}`}>District</Label>
                    <Input
                      id={`district-${address.id}`}
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                      disabled={loading}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`ward-${address.id}`}>Ward</Label>
                    <Input
                      id={`ward-${address.id}`}
                      value={formData.ward}
                      onChange={(e) =>
                        setFormData({ ...formData, ward: e.target.value })
                      }
                      disabled={loading}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`postalCode-${address.id}`}>
                      Postal Code
                    </Label>
                    <Input
                      id={`postalCode-${address.id}`}
                      value={formData.postal_code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          postal_code: e.target.value,
                        })
                      }
                      disabled={loading}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    id={`isDefault-${address.id}`}
                    checked={formData.is_default}
                    onChange={(e) =>
                      setFormData({ ...formData, is_default: e.target.checked })
                    }
                    disabled={loading}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label
                    htmlFor={`isDefault-${address.id}`}
                    className="text-sm"
                  >
                    Set as default address
                  </Label>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {loading ? "Saving..." : "Update"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // Display mode
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {address.is_default && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                          Default
                        </span>
                      )}
                      Delivery Address
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium mb-1">
                    {formatFullAddress(address)}
                  </p>
                  {address.postal_code && (
                    <p className="text-sm text-gray-500">
                      Postal Code: {address.postal_code}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address)}
                    disabled={loading}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    disabled={loading || address.is_default}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}

        {addresses.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No delivery addresses yet
            </h4>
            <p className="text-gray-500 mb-4">
              Add delivery addresses so customers can order from your store
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add your first address
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
