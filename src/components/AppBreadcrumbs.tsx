import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/components/ui";
import { IconHome } from "@tabler/icons-react";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export interface BreadcrumbSegment {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  path?: string;
}

interface AppBreadcrumbsProps {
  segments?: BreadcrumbSegment[];
  homeLabel?: string;
  homePath?: string;
  className?: string;
}

export function AppBreadcrumbs({
  segments = [],
  homeLabel,
  homePath = "/home",
  className,
}: AppBreadcrumbsProps) {
  const navigate = useNavigate();
  const [t] = useTranslation();

  const effectiveHomeLabel = homeLabel || t("home.title");

  const handleHomeClick = () => {
    navigate(homePath);
  };

  const handleSegmentClick = (segment: BreadcrumbSegment) => {
    if (segment.onClick) {
      segment.onClick();
    } else if (segment.path) {
      navigate(segment.path);
    }
  };

  return (
    <Breadcrumbs className={className}>
      <BreadcrumbItem
        onClick={handleHomeClick}
        isActive={segments.length === 0}
      >
        <IconHome size="1em" /> {effectiveHomeLabel}
      </BreadcrumbItem>

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const isClickable = segment.onClick || segment.path;

        return (
          <React.Fragment key={`${segment.label}-${index}`}>
            <BreadcrumbSeparator />
            <BreadcrumbItem
              onClick={
                isClickable ? () => handleSegmentClick(segment) : undefined
              }
              isActive={isLast}
            >
              {segment.icon && <>{segment.icon} </>}
              {segment.label}
            </BreadcrumbItem>
          </React.Fragment>
        );
      })}
    </Breadcrumbs>
  );
}
