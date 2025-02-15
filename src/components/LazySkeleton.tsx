import { Skeleton } from "@mantine/core";
import React, { useEffect, useState } from "react";

interface LazySkeletonProps {
  w?: string;
  h?: string;
}

function LazySkeleton({ w, h }: LazySkeletonProps) {
  const [showComponent, setShowComponent] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setShowComponent(true);
    }, 200);
  });
  return <Skeleton visible={showComponent} w={w} h={h} />;
}

export default LazySkeleton;
