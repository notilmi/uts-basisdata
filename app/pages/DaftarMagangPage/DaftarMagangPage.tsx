import {
  ActionIcon,
  Badge,
  Button,
  Container,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import type { Route } from "./+types/DaftarMagangPage";
import { MagangRepository } from "~/persistence/repository/MagangRepository";
import { DosenRepository } from "~/persistence/repository/DosenRepository";
import { MahasiswaRepository } from "~/persistence/repository/MahasiswaRepository";
import { $dbconn } from "~/lib/db";
import { IconPlus, IconTrash, IconEdit } from "@tabler/icons-react";
import { Form, Link } from "react-router";

export async function loader() {
  const db = await $dbconn;

  const magangRepository = new MagangRepository(db);
  const dosenRepository = new DosenRepository(db);
  const mahasiswaRepository = new MahasiswaRepository(db);

  const magangList = await magangRepository.getAllMagang();
  const dosenList = await dosenRepository.getAllDosen();
  const mahasiswaList = await mahasiswaRepository.getAllMahasiswa();

  // Create lookup maps for easier access
  const dosenMap = new Map(dosenList.map((d) => [d.id, d]));
  const mahasiswaMap = new Map(mahasiswaList.map((m) => [m.id, m]));

  return { magangList, dosenMap, mahasiswaMap };
}

export async function action({ request }: Route.ActionArgs) {
  const db = await $dbconn;

  const formData = await request.formData();
  const id = formData.get("id") as string;

  const magangRepository = new MagangRepository(db);

  await magangRepository.deleteMagang(Number(id));

  return { success: true };
}

export type DaftarMagangPageProps = Route.ComponentProps;

export default function DaftarMagangPage({
  loaderData,
}: DaftarMagangPageProps) {
  const { magangList, dosenMap, mahasiswaMap } = loaderData;

  const tableRows = magangList.map((magang, idx) => {
    const dosen = magang.dosen_pembimbing_id
      ? dosenMap.get(magang.dosen_pembimbing_id)
      : null;
    const mahasiswaNames =
      magang.mahasiswa_ids?.map((id) => mahasiswaMap.get(id)?.nama) || [];

    return (
      <Table.Tr key={magang.id}>
        <Table.Td>{idx + 1}</Table.Td>
        <Table.Td>{magang.nama}</Table.Td>
        <Table.Td>{magang.lokasi}</Table.Td>
        <Table.Td>{dosen ? dosen.nama : "-"}</Table.Td>
        <Table.Td>
          {new Date(magang.tanggal_mulai).toLocaleDateString("id-ID")}
        </Table.Td>
        <Table.Td>
          {new Date(magang.tanggal_selesai).toLocaleDateString("id-ID")}
        </Table.Td>
        <Table.Td>
          <Group gap="xs">
            {mahasiswaNames.length > 0 ? (
              mahasiswaNames.map((nama, i) => (
                <Badge key={i} size="sm" variant="light">
                  {nama}
                </Badge>
              ))
            ) : (
              <Text size="sm" c="dimmed">
                Tidak ada mahasiswa
              </Text>
            )}
          </Group>
        </Table.Td>
        <Table.Td>
          <Group gap="xs">
            <Link to={`/magang/edit/${magang.id}`}>
              <ActionIcon color="blue" variant="light">
                <IconEdit size={16} />
              </ActionIcon>
            </Link>
            <Form method="post">
              <input hidden name="id" value={magang.id} />
              <ActionIcon type="submit" color="red" variant="light">
                <IconTrash size={16} />
              </ActionIcon>
            </Form>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Container size={"xl"} py={"lg"}>
      <Stack>
        <Stack gap={0}>
          <Title order={2}>Daftar Magang</Title>
          <Text>Manajemen Informatika Politeknik Negeri Sriwijaya</Text>
        </Stack>
        <Group justify="flex-end">
          <Link to="/magang/tambah">
            <Button size="sm" leftSection={<IconPlus size={16} />}>
              Tambah Magang
            </Button>
          </Link>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>No.</Table.Th>
              <Table.Th>Nama Magang</Table.Th>
              <Table.Th>Lokasi</Table.Th>
              <Table.Th>Dosen Pembimbing</Table.Th>
              <Table.Th>Tanggal Mulai</Table.Th>
              <Table.Th>Tanggal Selesai</Table.Th>
              <Table.Th>Mahasiswa</Table.Th>
              <Table.Th>Aksi</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{tableRows}</Table.Tbody>
        </Table>
      </Stack>
    </Container>
  );
}
