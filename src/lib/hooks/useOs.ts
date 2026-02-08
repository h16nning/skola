import { useEffect, useState } from "react";

type OS = "windows" | "macos" | "linux" | "ios" | "android" | "undetermined";

export function useOs(): OS {
  const [os, setOs] = useState<OS>("undetermined");

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const platform = window.navigator.platform?.toLowerCase() || "";

    if (/iphone|ipad|ipod/.test(userAgent)) {
      setOs("ios");
    } else if (/android/.test(userAgent)) {
      setOs("android");
    } else if (/mac/.test(platform)) {
      setOs("macos");
    } else if (/win/.test(platform)) {
      setOs("windows");
    } else if (/linux/.test(platform)) {
      setOs("linux");
    } else {
      setOs("undetermined");
    }
  }, []);

  return os;
}
