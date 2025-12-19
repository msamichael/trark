"use client";

import { useEffect, useState } from "react";
import ShowCard from "./ShowCard";

export default function ShowGrid(){

    const [showList, setShowList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('')
    
    
    async function fetchAnime(query = '') {
        try{
          const endpoint = query? 
          `https://api.jikan.moe/v4/anime?q=${query}&status=upcoming`:
            'https://api.jikan.moe/v4/seasons/upcoming';
            
            const res = await fetch(endpoint);
            const data = await res.json();
            setShowList(data?.data || []);
        }catch(err){
            console.error(err)
        }
    }


    useEffect(() => {
    fetchAnime();
    }, [])
    
    return (
        <div>
          {showList.length === 0 ? (
            <p>Loading...</p>
          ):(
<div className=" overflow-x-hidden grid grid-cols-2 
          sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
           place-items-center items-start 
           gap-y-5 sm:gap-y-10 gap-x-2 sm:gap-x-7 w-full mt-5">
            {showList.map((anime: any, index:number) => (
              <ShowCard 
                key={anime.mal_id-index}
                showImage={anime.images.webp.large_image_url}
                showLink={anime.url}
                showName={anime.title}
                showAired={anime.aired.string}
              />
            ))}
          </div>

)
}
</div>
    )

}