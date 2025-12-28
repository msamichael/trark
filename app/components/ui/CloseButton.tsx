'use client';
import { setShowTrailer } from "@/app/store/trailerSlice";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";

export default function CloseButton (){

    const dispatch = useDispatch();

    return (
        <button
              onClick={() => dispatch(setShowTrailer(false))}
              className="absolute top-2 right-2 text-white text-3xl font-bold cursor-pointer"
            >
              <X/>
            </button>
    );
}