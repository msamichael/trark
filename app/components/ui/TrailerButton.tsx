'use client';

import { setShowTrailer } from "@/app/store/trailerSlice";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { useDispatch } from "react-redux";


export default function TrailerButton() {

const dispatch = useDispatch();

  return (

    <Button className="bg-white text-black w-fit cursor-pointer " 
    onClick={()=>(
        dispatch(setShowTrailer(true))
    )}>
      <Play />
      Watch Trailer
    </Button>
     
      
    
  );
}
