import type { Icon, IconProps } from "@tabler/icons-react";
import * as React from "react";

export type Route =
  | {
      label: string;
      icon: React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<Icon>
      >;
      initiallyOpened?: undefined;
      links?: undefined;
    }
  | {
      label: string;
      icon: React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<Icon>
      >;
      initiallyOpened: boolean;
      links: {
        label: string;
        link: string;
      }[];
    }
  | {
      label: string;
      icon: React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<Icon>
      >;
      links: {
        label: string;
        link: string;
      }[];
      initiallyOpened?: undefined;
    };
