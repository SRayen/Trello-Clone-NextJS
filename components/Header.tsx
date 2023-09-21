"use client";

import Image from "next/image";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";

export default function Header() {
  const [searchString, setSearchString] = useBoardStore((state) => [
    state.searchString,
    state.setSearchString,
  ]);
  return (
    <header>
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-[#7346acff] to-[#cd4eb2ff] rounded-md filter blur-3xl opacity-50 -z-50"></div>
      <div className="flex flex-col md:flex-row items-center p-5 rounded-b-2xl">
        <Image
          src="https://links.papareact.com/c2cdd5"
          alt="Trello Logo"
          width={300}
          height={300}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />
        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
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

          <Avatar name="S Rayen" size="50" round color="#085dd7ff" />
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p className="flex items-center p-5 text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#085dd7ff] mr-1">
          <UserCircleIcon className="inline-block h-10 w-10 text-[#085dd7ff] mr-1" />
          GPT is summarising your tasks for the day ...
        </p>
      </div>
    </header>
  );
}
