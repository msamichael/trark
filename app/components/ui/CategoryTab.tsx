"use client";

import { setTab } from "@/app/store/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function cTabs() {
  const ctabs = ["movies", "series", "anime"];

  const categoryTab = useSelector((state: RootState) => state.tab.categoryTab);

  const dispatch = useDispatch();

  return (
    <>
      <div className="px-3"> 
        <Tabs defaultValue="movies" className=" sm:hidden">
          <TabsList className="w-full bg-zinc-900">
            {ctabs.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={tab}
                className="capitalize transition-all duration-400 ease-out"
                onClick={() => dispatch(setTab(tab))}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="relativejustify-center overflow-hidden hidden sm:flex sm:justify-start gap-6 border-b border-zinc-100/40">
        {ctabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => dispatch(setTab(tab))}
            className={`relative pb-2 capitalize
                    after:absolute after:left-0 after:bottom-0
                    after:h-0.5 after:w-full
                    after:bg-white
                    after:opacity-0 after:scale-x-0
                    after:origin-left
                    after:transition-all after:duration-400 text-sm cursor-pointer
                    ${
                      categoryTab === tab
                        ? "after:opacity-100 after:scale-x-100"
                        : "text-zinc-400 hover:text-white"
                    }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </>
  );
}
