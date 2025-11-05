import * as React from "react";
import type { Route } from "./+types/TambahMagangPage";
import {
  Button,
  Container,
  Group,
  Input,
  Stack,
  Text,
  Title,
  Select,
  MultiSelect,
} from "@mantine/core";
import { Form } from "react-router";
import { IconChevronLeft, IconPlus } from "@tabler/icons-react";
import { $dbconn } from "~/lib/db";
import { MagangRepository } from "~/persistence/repository/MagangRepository";
import { DosenRepository } from "~/persistence/repository/DosenRepository";
import { MahasiswaRepository } from "~/persistence/repository/MahasiswaRepository";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router";

type TambahMagangProps = Route.ComponentProps;

export async function loader() {
  const db = await $dbconn;

  const dosenRepository = new DosenRepository(db);
  const mahasiswaRepository = new MahasiswaRepository(db);

  const dosenList = await dosenRepository.getAllDosen();
  const mahasiswaList = await mahasiswaRepository.getAllMahasiswa();

  return { dosenList, mahasiswaList };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const db = await $dbconn;
  const magangRepository = new MagangRepository(db);

  const mahasiswaIdsString = formData.get("mahasiswa_ids") as string;
  const mahasiswaIds = mahasiswaIdsString
    ? mahasiswaIdsString.split(",").map((id) => Number(id))
    : [];

  const dosenPembimbingId = formData.get("dosen_pembimbing_id") as string;

  const result = await magangRepository.createMagang(
    {
      nama: formData.get("nama") as string,
      lokasi: formData.get("lokasi") as string,
      dosen_pembimbing_id: dosenPembimbingId ? Number(dosenPembimbingId) : null,
      tanggal_mulai: new Date(formData.get("tanggal_mulai") as string),
      tanggal_selesai: new Date(formData.get("tanggal_selesai") as string),
    },
    mahasiswaIds,
  );

  return result;
}

export default function TambahMagang({
  loaderData,
  actionData,
}: TambahMagangProps) {
  const navigate = useNavigate();
  const { dosenList, mahasiswaList } = loaderData;

  const [selectedMahasiswa, setSelectedMahasiswa] = React.useState<string[]>(
    [],
  );
  const [selectedDosen, setSelectedDosen] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (actionData) {
      notifications.show({
        title: "Berhasil menambahkan magang",
        message: "Magang berhasil ditambahkan",
        color: "green",
      });
    }
  }, [actionData]);

  const dosenOptions = dosenList.map((dosen) => ({
    value: String(dosen.id),
    label: `${dosen.nama} (${dosen.nip})`,
  }));

  const mahasiswaOptions = mahasiswaList.map((mahasiswa) => ({
    value: String(mahasiswa.id),
    label: `${mahasiswa.nama} (${mahasiswa.nim})`,
  }));

  return (
    <Container size={"lg"} py={"lg"}>
      <Stack>
        <Button
          variant="light"
          onClick={() => navigate(-1)}
          style={{
            width: "fit-content",
          }}
          leftSection={<IconChevronLeft size={16} />}
        >
          Kembali
        </Button>
        <Stack gap={0}>
          <Title order={2}>Tambah Magang</Title>
          <Text>Tambah data magang baru</Text>
        </Stack>
        <Form method="post">
          <Stack>
            <Input.Wrapper label="Nama Magang" required withAsterisk>
              <Input name="nama" placeholder="Contoh: Magang PT. ABC" />
            </Input.Wrapper>

            <Input.Wrapper label="Lokasi" required withAsterisk>
              <Input name="lokasi" placeholder="Contoh: Jakarta" />
            </Input.Wrapper>

            <Select
              label="Dosen Pembimbing"
              placeholder="Pilih dosen pembimbing"
              data={dosenOptions}
              value={selectedDosen}
              onChange={setSelectedDosen}
              searchable
              clearable
            />
            <input
              hidden
              name="dosen_pembimbing_id"
              value={selectedDosen || ""}
            />

            <Input.Wrapper label="Tanggal Mulai" required withAsterisk>
              <Input name="tanggal_mulai" type="date" />
            </Input.Wrapper>

            <Input.Wrapper label="Tanggal Selesai" required withAsterisk>
              <Input name="tanggal_selesai" type="date" />
            </Input.Wrapper>

            <MultiSelect
              label="Mahasiswa"
              placeholder="Pilih mahasiswa"
              data={mahasiswaOptions}
              value={selectedMahasiswa}
              onChange={setSelectedMahasiswa}
              searchable
              clearable
            />
            <input
              hidden
              name="mahasiswa_ids"
              value={selectedMahasiswa.join(",")}
            />

            <Group justify="flex-end">
              <Button type="submit" leftSection={<IconPlus size={16} />}>
                Simpan
              </Button>
            </Group>
          </Stack>
        </Form>
      </Stack>
    </Container>
  );
}
