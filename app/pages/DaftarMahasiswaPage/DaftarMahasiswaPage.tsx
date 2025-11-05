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
import type { Route } from "./+types/DaftarMahasiswaPage";
import { MahasiswaRepository } from "~/persistence/repository/MahasiswaRepository";
import { $dbconn } from "~/lib/db";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Form, Link } from "react-router";

export async function loader() {
  const db = await $dbconn;

  const mahasiswaRepository = new MahasiswaRepository(db);

  const mahasiswaList = await mahasiswaRepository.getAllMahasiswa();

  return { mahasiswaList };
}

export async function action({ request }: Route.ActionArgs) {
  const db = await $dbconn;

  const formData = await request.formData();
  const id = formData.get("id") as string;

  const mahasiswaRepository = new MahasiswaRepository(db);

  await mahasiswaRepository.deleteMahasiswa(Number(id));

  return { success: true };
}

export type HomePageProps = Route.ComponentProps;

export default function HomePage({ loaderData }: HomePageProps) {
  const tableRows = loaderData.mahasiswaList.map((mahasiswa, idx) => (
    <Table.Tr>
      <Table.Td>{idx + 1}</Table.Td>
      <Table.Td>{mahasiswa.nim}</Table.Td>
      <Table.Td>{mahasiswa.nama}</Table.Td>
      <Table.Td>{mahasiswa.tanggal_lahir.toLocaleDateString("id-ID")}</Table.Td>
      <Table.Td>{mahasiswa.alamat}</Table.Td>
      <Table.Td>
        <Form method="post">
          <input hidden name="id" value={mahasiswa.id} />
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
          <Title order={2}>Sistem Pendataan Magang Mahasiswa</Title>
          <Text>Manajemen Informatika Politeknik Negeri Sriwijaya</Text>
        </Stack>
        <Group justify="flex-end">
          <Link to="/mahasiswa/tambah">
            <Button size="sm" leftSection={<IconPlus size={16} />}>
              Tambah Mahasiswa
            </Button>
          </Link>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>No.</Table.Th>
              <Table.Th>NIM</Table.Th>
              <Table.Th>Nama</Table.Th>
              <Table.Th>Tanggal Lahir</Table.Th>
              <Table.Th>Alamat</Table.Th>
              <Table.Th>Aksi</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{tableRows}</Table.Tbody>
        </Table>
      </Stack>
    </Container>
  );
}
