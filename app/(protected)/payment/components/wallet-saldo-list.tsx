'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import React from "react"
import { SquareChevronRight } from 'lucide-react';
import { WalletSaldo } from "@/lib/model/wallet"
import { convertFloatToMoeda } from "@/lib/utils";
import { IconType } from "@/lib/model/types";
import { avatarComponents } from "@/components/pwicons/pwicons";

interface WalletSaldoListProps {
  saldoWallets: WalletSaldo[] | [];
}

const WalletSaldoList: React.FC<WalletSaldoListProps> = ({ saldoWallets }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" color="primary" variant="soft" className="h-5 w-5">
          <SquareChevronRight className="h-5 w-5 text-default-900" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Wallets Balance</SheetTitle>
          <SheetDescription>
            {/* Make changes to your profile here. Click save when you are done. */}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 62px)" }}>
          <ul className=" space-y-3 h-full ">
            {saldoWallets.map((item) => {

              const IconComponent = avatarComponents[item.descricao.avatar as IconType];
              return (
                <li
                  className="flex items-center gap-3 border-b border-default-100 dark:border-default-300 last:border-b-0 pb-3 last:pb-0"
                  key={item.id}
                >
                  {IconComponent ? (
                    <Avatar
                      className="rounded w-8 h-8"
                    >
                      <IconComponent />
                    </Avatar>
                  ) : (
                    <div>Error: Icon not found</div>
                  )}
                  <div className="flex-1 text-start overflow-hidden text-ellipsis whitespace-nowrap max-w-[63%]">
                    <div className="text-sm text-default-600  overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.descricao.text}
                    </div>
                  </div>
                  <div className="flex-none ">
                    <div className="text-sm font-light text-default-pw-700">
                      {convertFloatToMoeda(item.saldo)}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            {/* <Button type="submit">Save changes</Button> */}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default WalletSaldoList;