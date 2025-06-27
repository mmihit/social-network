"use client";

import { fetchData } from "@/app/helpers/fetch";
import { useEffect, useRef, useState } from "react";
import { GroupCard } from "./groupCard";
import Link from "next/link";

export function GroupList({ input }) {
  const [searchMessage, setSearchMessage] = useState("");
  const [groups, setGroups] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(1);
  const prevInput = useRef(input);
  const prevOffset = useRef(offset);

  useEffect(() => {
    const getData = async () => {
      //   console.log(prevInput.current, input);
      var flag = false;

      //   let Offset = offset;
      if (prevInput.current !== input) {
        console.log("input changed", input);
        console.log("offset not changed", offset);
        setOffset(1);
        flag = true;
      }

      const data = await fetchData(
        `http://localhost:8080/api/groups/search?q=${input}&offset=${offset}`
      );

      if (data.groups) {
        if (flag) {
          console.log("tt");
          setGroups(data.groups);
        } else if (prevOffset !== offset) {
          console.log("offset changed", offset);
          console.log("input not changed", input);
          setGroups([...groups, ...data.groups]);
        } else {
          console.log(
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa***********************"
          );
        }
        setHasMore(data.hasMore);
      } else if (data.message) {
        setSearchMessage(data.message);
        setHasMore(false);
        setGroups([]);
      }
    };

    getData();
    setTimeout(() => {
      prevInput.current = input;
      prevOffset.current = offset;
    }, 500);
  }, [input, offset]);

  let date;

  return (
    <>
      {groups.length > 0 ? (
        groups.map(
          (group, key) => (
            (date = new Date(group.created_at)),
            (
              <Link key={key} href={`/groups/${group.id}`}>
                <GroupCard
                  title={group.title}
                  description={group.description}
                  created_at={date.toDateString()}
                  creatorId={group.creator.id}
                  creatorNickname={group.creator.nickname}
                  status={group.status}
                />
              </Link>
            )
          )
        )
      ) : (
        <p>{searchMessage}</p>
      )}
      {hasMore ? (
        <a
          onClick={() => {
            setOffset(offset + 1);
          }}
        >
          more...
        </a>
      ) : (
        <></>
      )}
    </>
  );
}
