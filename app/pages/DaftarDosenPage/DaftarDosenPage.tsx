import {
  ActionIcon,
  Button,
  Container,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import type { Route } from "./+types/DaftarDosenPage";
import { DosenRepository } from "~/persistence/repository/DosenRepository";
import { $dbconn } from "~/lib/db";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Form, Link } from "react-router";

export async function loader() {
  const db = await $dbconn;

  const dosenRepository = new DosenRepository(db);

  const dosenList = await dosenRepository.getAllDosen();

  return { dosenList };
}

export async function action({ request }: Route.ActionArgs) {
  const db = await $dbconn;

  const formData = await request.formData();
  const id = formData.get("id") as string;

  const dosenRepository = new DosenRepository(db);

  await dosenRepository.deleteDosen(Number(id));

  return { success: true };
}

export type DaftarDosenPageProps = Route.ComponentProps;

export default function DaftarDosenPage({ loaderData }: DaftarDosenPageProps) {
  const tableRows = loaderData.dosenList.map((dosen, idx) => (
    <Table.Tr key={dosen.id}>
      <Table.Td>{idx + 1}</Table.Td>
      <Table.Td>{dosen.nip}</Table.Td>
      <Table.Td>{dosen.nama}</Table.Td>
      <Table.Td>
        <Form method="post">
          <input hidden name="id" value={dosen.id} />
          <ActionIcon type="submit" color="red" variant="light">
            <IconTrash size={16} />
          </ActionIcon>
        </Form>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size={"lg"} py={"lg"}>
      <Stack>
        <Stack gap={0}>
          <Title order={2}>Daftar Dosen</Title>
          <Text>Manajemen Informatika Politeknik Negeri Sriwijaya</Text>
        </Stack>
        <Group justify="flex-end">
          <Link to="/dosen/tambah">
            <Button size="sm" leftSection={<IconPlus size={16} />}>
              Tambah Dosen
            </Button>
          </Link>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>No.</Table.Th>
              <Table.Th>NIP</Table.Th>
              <Table.Th>Nama</Table.Th>
              <Table.Th>Aksi</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{tableRows}</Table.Tbody>
        </Table>
      </Stack>
    </Container>
  );
}
