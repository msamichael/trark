'use client';

import { setShowTrailer } from "@/app/store/trailerSlice";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { useDispatch } from "react-redux";


export default function TrailerButton() {

const dispatch = useDispatch();

  return (
    <Button variant="outline" className="bg-black/40 text-white border-white/30 hover:bg-white/10 hover:text-white w-fit cursor-pointer backdrop-blur-sm" 
    onClick={()=>(
        dispatch(setShowTrailer(true))
    )}>
      <Play />
      Watch Trailer
    </Button>
      
     
    

  );
}
