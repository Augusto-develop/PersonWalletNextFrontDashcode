

export type SubChildren = {
  href: string;
  label: string;
  active: boolean;
  children?: SubChildren[];
};
export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus?: Submenu[];
  children?: SubChildren[];
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
  id: string;
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
  id: string;
};

export function getMenuList(pathname: string, t: any): Group[] {

  return [
    {
      // groupLabel: t("dashboard"),
      groupLabel: "",
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/dashboard",
          label: t("dashboard"),
          active: pathname.includes("/dashboard"),
          icon: "mdi:home",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Credits",
      id: "credits",
      menus: [
        {
          id: "credits",
          href: "/credits/creditcards",
          label: "Credits",
          active: pathname.includes("/credits/creditcards"),
          icon: "mdi:bank",
          submenus: [
            {
              href: "/credits/creditcards",
              label: "Credit Cards",
              active: pathname === "/credits/creditcards",
              icon: "heroicons-outline:credit-card",
              children: [],
            },
            {
              href: "/dashboard/dash-ecom",
              label: "Financing",
              active: pathname === "/dashboard/dash-ecom",
              icon: "mdi:bank-transfer-out",
              children: [],
            },
            {
              href: "/dashboard/dash-ecom",
              label: "Lending",
              active: pathname === "/dashboard/dash-ecom",
              icon: "mdi:cash-multiple",
              children: [],
            },
          ],
        },
        {
          id: "wallets",
          href: "/wallets",
          label: "Wallets",
          active: pathname.includes("/wallets"),
          icon: "mdi:wallet",
          submenus: [],
        },
        {
          id: "categories",
          href: "/categories",
          label: "Categories",
          active: pathname.includes("/categories"),
          icon: "mdi:category",
          submenus: [],
        }
      ],
    },
  ];
}
export function getHorizontalMenuList(pathname: string, t: any): Group[] {
  return [
    {
      groupLabel: t("dashboard"),
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/",
          label: t("dashboard"),
          active: pathname.includes("/"),
          icon: "heroicons-outline:home",
          submenus: [],
        },
      ],
    },
  ];
}