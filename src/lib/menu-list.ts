import {
  Users,
  Settings,
  SquarePen,
  LucideIcon,
  MessageSquare,
  Bell,
  House
} from "lucide-react";


type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dm",
          label: "DM",
          active: pathname.includes("/dm"),
          icon: MessageSquare,
          submenus: []
        },
        {
          href: "/notification",
          label: "notification",
          active: pathname.includes("/notification"),
          icon: Bell,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/profile",
          label: "My Profile",
          active: pathname.includes("/profile"),
          icon: Users,
          submenus: []
        },
        {
          href: "/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: Settings,
          submenus: []
        }
      ]
    }
  ];
}
