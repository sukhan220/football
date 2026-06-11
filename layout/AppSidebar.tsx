
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  LayoutDashboard,
  Calendar,
  UserCircle,
  List,
  Table,
  FileText,
  PieChart,
  Box,
  Plug,
  ChevronDown,
  MoreHorizontal,
  FolderKanban,
  Trophy,
  ListOrdered,
  Settings,
  ShieldCheck,
  Users,
  BookOpen
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  { 
    icon: <LayoutDashboard size={20} />, 
    name: "Dashboard", 
    path: "/admin/dashboard" 
  },
  { 
    icon: <FileText size={20} />, 
    name: "News", 
    subItems: [
      { name: "All News", path: "/admin/news" },
      { name: "Create News", path: "/admin/create" }
    ] 
  },
  { 
    icon: <FolderKanban size={20} />, 
    name: "Categories", 
    subItems: [
      { name: "Categories", path: "/admin/categories/all_categories"  },
      { name: "Add Category", path: "/admin/categories" }
    ] 
  },
  { 
    icon: <Trophy size={20} />, 
    name: "Fixtures", 
    path: "/admin/fixtures" 
  },
  { 
    icon: <Table size={20} />, 
    name: "Tables", 
    path: "/admin/tables" 
  },
  { 
    icon: <BookOpen size={20} />, 
    name: "E-Magazine", 
    subItems: [
      { name: "Ball", path: "/admin/e-magazine/ball/all_ball"  },
      { name: "Mascot", path: "/admin/e-magazine/mascot/all_mascot" },
       { name: "Technology", path: "/admin/e-magazine/technology" },
       { name: "New Rules", path: "/admin/e-magazine/rules" },
       { name: "Champions & Medals", path: "/admin/e-magazine/champions" },
    ] 
  },
];

const othersItems: NavItem[] = [
  { 
    icon: <Users size={20} />, 
    name: "Users", 
    path: "/admin/users" 
  },
  { 
    icon: <ShieldCheck size={20} />, 
    name: "Roles", 
    path: "/admin/roles" 
  },
  { 
    icon: <Settings size={20} />, 
    name: "Settings", 
    path: "/admin/settings" 
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => (prev && prev.type === menuType && prev.index === index) ? null : { type: menuType, index });
  };

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems?.some(sub => isActive(sub.path))) {
          setOpenSubmenu({ type: menuType as "main" | "others", index });
          submenuMatched = true;
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight(prev => ({ ...prev, [key]: subMenuRefs.current[key]?.scrollHeight || 0 }));
      }
    }
  }, [openSubmenu]);

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button onClick={() => handleSubmenuToggle(index, menuType)} className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"}`}>
              <span className={openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}>{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              {(isExpanded || isHovered || isMobileOpen) && <ChevronDown className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""}`} />}
            </button>
          ) : (
            nav.path && (
              <Link href={nav.path} className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
                <span className={isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}>{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div ref={(el) => { subMenuRefs.current[`${menuType}-${index}`] = el; }} className="overflow-hidden transition-all duration-300" style={{ height: openSubmenu?.type === menuType && openSubmenu?.index === index ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px" }}>
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((sub) => (
                  <li key={sub.name}><Link href={sub.path} className={`menu-dropdown-item ${isActive(sub.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}>{sub.name}</Link></li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 h-screen transition-all duration-300 z-50 border-r border-gray-200 ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`} onMouseEnter={() => !isExpanded && setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/">Logo</Link>
      </div>
      
      {/* স্ক্রলবার হাইড করার জন্য নিচের ডিভটিতে স্টাইল যুক্ত করা হয়েছে */}
      <div 
        className="flex flex-col overflow-y-auto"
        style={{
          msOverflowStyle: 'none',  /* IE and Edge */
          scrollbarWidth: 'none',  /* Firefox */
        }}
      >
        {/* Chrome, Safari এবং Opera-এর জন্য স্ক্রলবার হাইড করার স্টাইল ট্যাগ */}
        <style dangerouslySetInnerHTML={{__html: `
          .flex.flex-col.overflow-y-auto::-webkit-scrollbar {
            display: none;
          }
        `}} />

        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>{isExpanded || isHovered || isMobileOpen ? "Menu" : <MoreHorizontal />}</h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>{isExpanded || isHovered || isMobileOpen ? "Others" : <MoreHorizontal />}</h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;