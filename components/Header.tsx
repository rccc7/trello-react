"use client"; //Since we're using Avatar component, we need to convert this component into a client component
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import fetchSuggestion from "@/lib/fetchSuggestion";

function Header() {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);

  // This variable determines whether the chatGPT suggestion is loading....
  const [loading, setLoading] = useState<boolean>(false);
  //the suggestion
  const [suggestion, setSuggestion] = useState<string>("");

  // make the api calls to our openai api:
  useEffect(() => {
    // board.columns is a map, that is why we call its size property.
    if (board.columns.size === 0) return;
    setLoading(true);

    // Create a helper function inside the useEffect to fetch the suggestion
    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
      setLoading(false);
    };

    // Execute the function created above 👆👆👆
    fetchSuggestionFunc();
  }, [board]); //The update of the effect depnds on the board changes.

  return (
    <header>
      <div className="flex flex-col items-center p-5 bg-gray-500/10 rounded-b-2xl justify-between md:flex-row">
        {/* Invisible div (hidden) which will act as a gradient 
        bg-gradient-to-br from-green-400 to-[#0055D1]--> background gradient to bottom right
        filter blur-3xl opacity-50 -z-50 --> go together in order to make the gradient 
        translucent and send it behind the other components
        */}
        <div
          className="absolute top-0 left-0 w-full h-96 
        bg-gradient-to-br from-green-400 to-[#0055D1] rounded-md 
        filter blur-3xl opacity-50 -z-50"
        />
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/facebook-clone-f94bd.appspot.com/o/Trellio-react-clone-logo-blue.png?alt=media&token=2cf2ad50-51aa-4771-894d-1a797f57a6ed"
          alt="Trello orignal Logo obtained from Wikimedia Commons at: https://commons.wikimedia.org/wiki/File:Trello-logo-blue.svg"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />
        <div className=" flex items-center space-x-5 flex-1 justify-end  w-full">
          {/* Search Box */}
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial border m-5">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>
          {/* Avatar */}
          <Avatar name="RCCC" round color="#0055D1" size="50" />
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p
          className="flex items-center p-5 text-sm font-light pr-5 shadow-xl rounded-xl 
        w-fit bg-white italic max-w-3xl text-[#0055D1]"
        >
          <UserCircleIcon
            className={`inline-block h-10 w-10 text-[#0055D1] mr-1
          ${loading && "animate-spin"}`}
          />
          {suggestion && !loading
            ? suggestion
            : "GPT is summarising your tasks for the day..."}
        </p>
      </div>
    </header>
  );
}

export default Header;
