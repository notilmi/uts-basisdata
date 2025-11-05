import * as React from "react";
import {
  IconAdjustments,
  IconCalendarStats,
  IconFileAnalytics,
  IconGauge,
  IconNotes,
  IconPresentationAnalytics,
} from "@tabler/icons-react";
import type { Route } from "~/types/routes";
import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Outlet } from "react-router";
import NavbarNested from "~/components/NavbarNested/NavbarNested";

interface DashboardLayoutProps {}

const ROUTES: Route[] = [
  { label: "Dashboard", icon: IconGauge },
  {
    label: "Market news",
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: "Overview", link: "/" },
      { label: "Forecasts", link: "/" },
      { label: "Outlook", link: "/" },
      { label: "Real time", link: "/" },
    ],
  },
  {
    label: "Releases",
    icon: IconCalendarStats,
    links: [
      { label: "Upcoming releases", link: "/" },
      { label: "Previous releases", link: "/" },
      { label: "Releases schedule", link: "/" },
    ],
  },
  { label: "Analytics", icon: IconPresentationAnalytics },
  { label: "Contracts", icon: IconFileAnalytics },
  { label: "Settings", icon: IconAdjustments },
];

export default function DashboardLayout({}: DashboardLayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const isMobile = useMediaQuery("(max-width: 48em)");

  return (
    <AppShell
      padding="md"
      header={{
        height: { base: isMobile ? 60 : 0 },
      }}
      navbar={{
        width: { base: 200, md: 300 },
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
