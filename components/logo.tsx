'use client'
import React from "react";
import DashCodeLogo from "./dascode-logo";
import { PwLogoAvatarIcon, PwLogoNameIcon } from "./pwicons/pwicons";
import Link from 'next/link';
import { useConfig } from "@/hooks/use-config";
import { useMenuHoverConfig } from "@/hooks/use-menu-hover";
import { useMediaQuery } from "@/hooks/use-media-query";



const Logo = () => {
    const [config] = useConfig()
    const [hoverConfig] = useMenuHoverConfig();
    const { hovered } = hoverConfig
    const isDesktop = useMediaQuery('(min-width: 1280px)');

    if (config.sidebar === 'compact') {
        return <Link href="/dashboard/analytics" className="flex gap-2 items-center   justify-center    ">
            {/* <DashCodeLogo className="  text-default-900 h-8 w-8 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background" /> */}
            <PwLogoAvatarIcon />
        </Link>
    }
    // if (config.sidebar === 'two-column' || !isDesktop) return null
    
    return (
        <Link href="/dashboard/analytics" className="flex gap-2 items-center    ">
            {/* <DashCodeLogo className="  text-default-900 h-8 w-8 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background" /> */}
            <PwLogoAvatarIcon />
            {(!config?.collapsed || hovered) && (

                <PwLogoNameIcon fontSize="24px" />

            )}
        </Link>

    );
};

export default Logo;
