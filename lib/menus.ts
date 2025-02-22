

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

export function getMenuList(pathname: string): Group[] {

  return [
    {
      // groupLabel: "dashboard",
      groupLabel: "",
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/dashboard",
          label: "dashboard",
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
          href: "/credits",
          label: "Credits",
          active: ['/credits', '/credits/creditcards', '/credits/financings', '/credits/lendings'].some(path => pathname.includes(path)), icon: "mdi:bank",
          submenus: [
            {
              href: "/credits/creditcards",
              label: "Credit Cards",
              active: pathname === "/credits/creditcards",
              icon: "heroicons-outline:credit-card",
              children: [],
            },
            {
              href: "/credits/financings",
              label: "Financings",
              active: pathname === "/credits/financings",
              icon: "mdi:bank-transfer-out",
              children: [],
            },
            {
              href: "/credits/lendings",
              label: "Lending",
              active: pathname === "/credits/lendings",
              icon: "mdi:account-cash-outline",
              children: [],
            },
            {
              href: "/credits/recurrings",
              label: "Recurring",
              active: pathname === "/credits/recurrings",
              icon: "mdi:graph-pie",
              children: [],
            },
            {
              href: "/credits/cashpayments",
              label: "Cash Payments",
              active: pathname === "/credits/cashpayments",
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
          id: "revenues",
          href: "/revenues",
          label: "Revenues",
          active: pathname.includes("/revenues"),
          icon: "mdi:hand-coin",
          submenus: [],
        },
        {
          id: "categories",
          href: "/categories",
          label: "Categories",
          active: pathname.includes("/categories"),
          icon: "mdi:category",
          submenus: [],
        },
        {
          id: "expenses",
          href: "/expenses",
          label: "Expenses",
          active: pathname.includes("/expenses"),
          icon: "mdi:receipt-text",
          submenus: [],
        },
        {
          id: "payment",
          href: "/payment",
          label: "Payment",
          active: pathname.includes("/payment"),
          icon: "mdi:recurring-payment",
          submenus: [],
        },        
      ],
    },
  ];
}
export function getHorizontalMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "dashboard",
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/",
          label: "dashboard",
          active: pathname.includes("/"),
          icon: "heroicons-outline:home",
          submenus: [],
        },
      ],
    },
  ];
}