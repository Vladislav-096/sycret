import { useEffect } from "react";

export const useClickOutside = (
  refs: React.MutableRefObject<HTMLDivElement | null>[],
  callback: () => void
) => {
  const handleClick = (e: MouseEvent) => {
    const isOutside = refs.every(
      (ref) => ref.current && !ref.current.contains(e.target as Node)
    );
    if (isOutside) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleClick);
    // document.addEventListener("scroll", handleClick);
    return () => {
      document.removeEventListener("mouseup", handleClick);
    };
  });
};
