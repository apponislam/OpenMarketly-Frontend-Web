import React, { useState, useEffect } from "react";

export function CountdownTimer() {
  const [time, setTime] = useState({ h: 5, m: 42, s: 17 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime((p) => {
        let { h, m, s } = p;
        if (--s < 0) {
          s = 59;
          if (--m < 0) {
            m = 59;
            if (--h < 0) h = 23;
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1.5">
      {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="bg-[#2c1654] text-white text-sm font-black font-mono px-2.5 py-1.5 rounded-lg min-w-[2.5rem] text-center tabular-nums">
            {v}
          </span>
          {i < 2 && <span className="text-[#2c1654] font-black">:</span>}
        </span>
      ))}
    </div>
  );
}
