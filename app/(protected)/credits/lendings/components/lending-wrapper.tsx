"use client"
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateLending from "./lending-create";
import { useState } from "react";
import React from "react";

const CreditCardWrapper = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div>
            <CreateLending
                open={open}
                setOpen={setOpen}
            />
            <div className="flex w-full flex-wrap items-center gap-4 mb-6">
                <h4 className="flex-1 font-medium lg:text-2xl text-xl capitalize text-default-900">
                    Lendings
                </h4>
                <div className="flex items-center gap-4 flex-wrap">                    
                    <Button
                        className="flex-none"
                        onClick={() => setOpen(true)}
                    >
                        <Plus className="w-4 h-4 me-1" />
                        <span>Add</span>
                    </Button>
                </div>
            </div>
            {children}
        </div>
    );
};

export default CreditCardWrapper;