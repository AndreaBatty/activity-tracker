"use client";

import { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;
      const scrollingUp = currentScrollY < lastScrollY.current;

      if (currentScrollY < 24) {
        setIsVisible(true);
      } else if (scrollingDown) {
        setIsVisible(false);
      } else if (scrollingUp) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 bg-background/85 px-3 py-4 backdrop-blur-xl transition-transform duration-300 ease-out sm:px-4 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground sm:text-sm">
            Domenica, 17 maggio
          </p>
          <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
            Ciao Andrea
          </h1>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="shrink-0 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}