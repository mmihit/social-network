"use client";

import { useState } from "react";
import { SearchInput } from "../global/textInput";
import { GroupList } from "./groupList";
import { CreateGroup } from "./createGroup";
import style from "@/app/styles/components/searchGroups.module.css"
import { usePathname } from "next/navigation";

export function SearchGroup() {
  const [searchValue, setSearchValue] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const pathname= usePathname()

  return (
    <>
      <div className={style.container}>
        <SearchInput
          placeHolder="Search for groups..."
          handler={setSearchValue}
        />

        <button className={style.createGroupBtn} onClick={() => setShowCreateGroup(true)}>
          Create Group
        </button>
      </div>

      <div>
        <GroupList key={pathname} input={searchValue} />
      </div>

      {showCreateGroup && (
        <CreateGroup onClose={() => setShowCreateGroup(false)} />
      )}
    </>
  );
}