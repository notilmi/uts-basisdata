import { useState } from "react";
import { Burger, Container, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";

const links = [
  { link: "/mahasiswa", label: "Mahasiswa" },
  { link: "/dosen", label: "Dosen" },
  { link: "/magang", label: "Magang" },
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => (
    <a key={link.label} href={link.link} className={classes.link}>
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Title order={2}>Kelompok 6</Title>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
