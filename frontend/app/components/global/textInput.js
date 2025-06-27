"use client";

export function SearchInput({ placeHolder, handler }) {
  return (
    <input
      placeholder={placeHolder}
      type="text"
      onChange={(e) => {
        handler(e.target.value);
      }}
    ></input>
  );
}
