import React from "react";
import "./Skeleton.css";

const BASE_URL = "skeleton";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
  visible?: boolean;
}

function Skeleton({
  width,
  height,
  borderRadius,
  className = "",
  visible = true,
}: SkeletonProps) {
  return (
    <div
      className={`${BASE_URL} ${visible ? `${BASE_URL}--visible` : ""} ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
}

export default Skeleton;
