import { useState, useEffect } from "react";
export function useLocalstoragestate(intialstate, key) {
  const [value, setvalue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : intialstate;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setvalue];
}
