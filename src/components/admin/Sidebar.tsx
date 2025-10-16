import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "📊",
    },
    {
      name: "Motorcycles",
      href: "/motorcycles",
      icon: "🏍️",
    },
    {
      name: "Buyers",
      href: "/buyers",
      icon: "👥",
    },
  ];

  return (
    <aside
      className={`bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Admin Panel
        </h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
