'use client';

import { useState } from "react";

const tabs = ['All', 'Movies', 'Series', 'Anime'];

export default function Tabs(){
    const [active, setActive] = useState('All');

    return (
        <div className="relative flex gap-6 border-b border-zinc-100/40">
            {tabs.map((tab, index)=>(
                <button 
                key={index}
                onClick={()=> setActive(tab)}
                className={`relative pb-2
    after:absolute after:left-0 after:bottom-0
    after:h-0.5 after:w-full
    after:bg-white
    after:opacity-0 after:scale-x-0
    after:origin-left
    after:transition-all after:duration-400 text-sm cursor-pointer  ${active === tab ? "after:opacity-100 after:scale-x-100": "text-zinc-400 hover:text-white"}`}>
                {tab}
                </button>
            ))}


        </div>
    )
}