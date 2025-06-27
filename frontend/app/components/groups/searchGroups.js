"use client";

import { useState } from "react";
import { SearchInput } from "../global/textInput";
import { GroupList } from "./groupList";

export function SearchGroup() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <SearchInput
        placeHolder="search for a groups..."
        handler={setSearchValue}
      ></SearchInput>

      <GroupList input={searchValue}></GroupList>
    </>
  );
}
