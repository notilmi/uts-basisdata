import * as React from "react";
import type { Route } from "./+types/EditMagangPage";
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
  LoadingOverlay,
} from "@mantine/core";
import { Form } from "react-router";
import { IconChevronLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { $dbconn } from "~/lib/db";
import { MagangRepository } from "~/persistence/repository/MagangRepository";
import { DosenRepository } from "~/persistence/repository/DosenRepository";
import { MahasiswaRepository } from "~/persistence/repository/MahasiswaRepository";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router";

type EditMagangProps = Route.ComponentProps;

export async function loader({ params }: Route.LoaderArgs) {
  const db = await $dbconn;

  const magangRepository = new MagangRepository(db);
  const dosenRepository = new DosenRepository(db);
  const mahasiswaRepository = new MahasiswaRepository(db);

  const magangId = Number(params.id);
  const magang = await magangRepository.getMagangById(magangId);

  if (!magang) {
    throw new Response("Magang not found", { status: 404 });
  }

  const dosenList = await dosenRepository.getAllDosen();
  const mahasiswaList = await mahasiswaRepository.getAllMahasiswa();

  return { magang, dosenList, mahasiswaList };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  const db = await $dbconn;
  const magangRepository = new MagangRepository(db);

  const mahasiswaIdsString = formData.get("mahasiswa_ids") as string;
  const mahasiswaIds = mahasiswaIdsString
    ? mahasiswaIdsString.split(",").map((id) => Number(id))
    : [];

  const dosenPembimbingId = formData.get("dosen_pembimbing_id") as string;
  const magangId = Number(params.id);

  const result = await magangRepository.updateMagang(
    magangId,
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

export default function EditMagang({
  loaderData,
  actionData,
}: EditMagangProps) {
  const navigate = useNavigate();
  const { magang, dosenList, mahasiswaList } = loaderData;

  const [selectedMahasiswa, setSelectedMahasiswa] = React.useState<string[]>(
    magang.mahasiswa_ids?.map(String) || [],
  );
  const [selectedDosen, setSelectedDosen] = React.useState<string | null>(
    magang.dosen_pembimbing_id ? String(magang.dosen_pembimbing_id) : null,
  );

  React.useEffect(() => {
    if (actionData) {
      notifications.show({
        title: "Berhasil mengupdate magang",
        message: "Data magang berhasil diperbarui",
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

  // Format dates for input fields (YYYY-MM-DD)
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
          <Title order={2}>Edit Magang</Title>
          <Text>Edit data magang yang sudah ada</Text>
        </Stack>
        <Form method="post">
          <Stack>
            <Input.Wrapper label="Nama Magang" required withAsterisk>
              <Input
                name="nama"
                defaultValue={magang.nama}
                placeholder="Contoh: Magang PT. ABC"
              />
            </Input.Wrapper>

            <Input.Wrapper label="Lokasi" required withAsterisk>
              <Input
                name="lokasi"
                defaultValue={magang.lokasi}
                placeholder="Contoh: Jakarta"
              />
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
              <Input
                name="tanggal_mulai"
                type="date"
                defaultValue={formatDate(magang.tanggal_mulai)}
              />
            </Input.Wrapper>

            <Input.Wrapper label="Tanggal Selesai" required withAsterisk>
              <Input
                name="tanggal_selesai"
                type="date"
                defaultValue={formatDate(magang.tanggal_selesai)}
              />
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
              <Button
                type="submit"
                leftSection={<IconDeviceFloppy size={16} />}
              >
                Update
              </Button>
            </Group>
          </Stack>
        </Form>
      </Stack>
    </Container>
  );
}
