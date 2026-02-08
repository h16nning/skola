import React, { useEffect, useState } from "react";
import Skeleton from "./ui/Skeleton";

interface LazySkeletonProps {
  w?: string;
  h?: string;
}

function LazySkeleton({ w, h }: LazySkeletonProps) {
  const [showComponent, setShowComponent] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponent(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return <Skeleton visible={showComponent} width={w} height={h} />;
}

export default LazySkeleton;
