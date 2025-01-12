"use client";

import React from 'react'
import { useCustomRouter } from "@/components/navigation";


import { getMenuList } from "@/lib/menus";


import IconNav from './icon-nav';
import SidebarNav from './sideabr-nav';


export function MenuTwoColumn() {
    // translate
    // const t = useTranslations("Menu")


    const { pathname } = useCustomRouter();
    
    const menuList = getMenuList(pathname);

    return (
        <>
            <IconNav menuList={menuList} />
            <SidebarNav menuList={menuList} />
        </>


    );
}
