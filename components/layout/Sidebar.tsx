"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Tag,
  Truck,
  Gift,
  Wallet,
  Star,
  FileBarChart,
  Store,
  TicketPercent,
  Bell,
  Megaphone,
  MessageCircle,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  userRole: "admin" | "seller";
  pendingStoresCount?: number;
  pendingDriversCount?: number;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: ("admin" | "seller")[];
  children?: NavItem[];
  badge?: number;
}

const navigationItems: NavItem[] = [
  {
    title: "Tổng quan",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["admin"],
  },
  {
    title: "Tổng quan",
    href: "/seller/dashboard",
    icon: LayoutDashboard,
    roles: ["seller"],
  },
  // Admin specific items
  {
    title: "Người dùng",
    href: "/admin/users/customers",
    icon: Users,
    roles: ["admin"],
    children: [
      {
        title: "Khách hàng",
        href: "/admin/users/customers",
        icon: Users,
        roles: ["admin"],
      },
      {
        title: "Cửa hàng",
        href: "/admin/users/sellers",
        icon: Store,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Tài xế",
    href: "/admin/drivers",
    icon: Truck,
    roles: ["admin"],
  },
  {
    title: "Danh mục",
    href: "/admin/categories",
    icon: Tag,
    roles: ["admin"],
  },
  {
    title: "Sản phẩm",
    href: "/admin/products",
    icon: Package,
    roles: ["admin"],
  },
  {
    title: "Thống kê",
    href: "/admin/reports",
    icon: FileBarChart,
    roles: ["admin"],
  },
  {
    title: "Đánh giá",
    href: "/admin/reviews",
    icon: Star,
    roles: ["admin"],
  },
  {
    title: "Ví tiền",
    href: "/admin/wallet",
    icon: Wallet,
    roles: ["admin"],
  },
  {
    title: "Khuyến mãi",
    href: "/admin/promotions/banners",
    icon: Gift,
    roles: ["admin"],
    children: [
      {
        title: "Banner",
        href: "/admin/promotions/banners",
        icon: Megaphone,
        roles: ["admin"],
      },
      {
        title: "Voucher",
        href: "/admin/promotions/vouchers",
        icon: TicketPercent,
        roles: ["admin"],
      },
    ],
  },
  // Seller specific items
  {
    title: "Danh mục",
    href: "/seller/categories",
    icon: Tag,
    roles: ["seller"],
  },
  {
    title: "Sản phẩm",
    href: "/seller/products",
    icon: Package,
    roles: ["seller"],
  },
  {
    title: "Đơn hàng",
    href: "/seller/orders",
    icon: ShoppingCart,
    roles: ["seller"],
  },
  {
    title: "Doanh thu",
    href: "/seller/revenue",
    icon: BarChart3,
    roles: ["seller"],
  },
  {
    title: "Đánh giá",
    href: "/seller/reviews",
    icon: Star,
    roles: ["seller"],
  },
  {
    title: "Voucher",
    href: "/seller/vouchers",
    icon: Gift,
    roles: ["seller"],
  },
  {
    title: "Trò chuyện",
    href: "/seller/chat",
    icon: MessageCircle,
    roles: ["seller"],
  },
  // {
  //   title: "Thông báo",
  //   href: "/seller/notifications",
  //   icon: Bell,
  //   roles: ["seller"],
  // },
  {
    title: "Ví tiền",
    href: "/seller/wallet",
    icon: Wallet,
    roles: ["seller"],
  },
  {
    title: "Hồ sơ",
    href: "/seller/profile",
    icon: Users,
    roles: ["seller"],
  },
];

export default function Sidebar({
  isOpen,
  onClose,
  userRole,
  pendingStoresCount = 0,
  pendingDriversCount = 0,
}: SidebarProps) {
  const pathname = usePathname();

  // Update Sellers menu item with pending stores count and Drivers with pending drivers count
  const navItemsWithBadge = navigationItems.map((item) => {
    if (
      item.title === "Người dùng" &&
      item.roles.includes("admin") &&
      item.children
    ) {
      return {
        ...item,
        children: item.children.map((child) => {
          if (child.title === "Người bán") {
            return { ...child, badge: pendingStoresCount };
          }
          return child;
        }),
      };
    }
    if (item.title === "Tài xế" && item.roles.includes("admin")) {
      return { ...item, badge: pendingDriversCount };
    }
    return item;
  });

  const filteredNavItems = navItemsWithBadge.filter((item) =>
    item.roles.includes(userRole)
  );

  const NavItemComponent = ({
    item,
    level = 0,
  }: {
    item: NavItem;
    level?: number;
  }) => {
    const isActive =
      pathname === item.href ||
      (item.children && item.children.some((child) => pathname === child.href));

    const Icon = item.icon;

    return (
      <div>
        <Link
          href={item.href}
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700",
            level > 0 && "ml-6",
            isActive
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
              : "text-gray-700 dark:text-gray-200"
          )}
        >
          <Icon className={cn("h-5 w-5", level > 0 && "h-4 w-4")} />
          <span>{item.title}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
              {item.badge}
            </span>
          )}
        </Link>

        {/* Render children if exists */}
        {item.children && (
          <div className="mt-1 space-y-1">
            {item.children
              .filter((child) => child.roles.includes(userRole))
              .map((child) => (
                <NavItemComponent
                  key={child.href}
                  item={child}
                  level={level + 1}
                />
              ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {filteredNavItems.map((item) => (
              <NavItemComponent key={item.href} item={item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              © 2025 QTI Food
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
