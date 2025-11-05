import * as React from "react";
import type { Route } from "./+types/TambahMahasiswaPage";
import {
  Button,
  Container,
  Group,
  Input,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Form } from "react-router";
import { IconChevronLeft, IconPlus } from "@tabler/icons-react";
import { $dbconn } from "~/lib/db";
import { MahasiswaRepository } from "~/persistence/repository/MahasiswaRepository";
import type { Mahasiswa } from "~/persistence/model/Mahasiswa";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router";

type TambahMahasiswaProps = Route.ComponentProps;

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const db = await $dbconn;
  const mahasiswaRepository = new MahasiswaRepository(db);

  const result = await mahasiswaRepository.createMahasiswa({
    nim: formData.get("nim") as string,
    nama: formData.get("nama") as string,
    tanggal_lahir: new Date(formData.get("tanggal_lahir") as string),
    alamat: formData.get("alamat") as string,
  });

  return result;
}

export default function TambahMahasiswa({ actionData }: TambahMahasiswaProps) {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (actionData) {
      notifications.show({
        title: "Berhasil menambahkan mahasiswa",
        message: "Mahasiswa berhasil ditambahkan",
        color: "green",
      });
      // Navigate back to mahasiswa list after successful creation
      setTimeout(() => {
        navigate("/");
      }, 500);
    }
  }, [actionData, navigate]);

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
          <Title order={2}>Tambah Mahasiswa</Title>
          <Text>Tambah data mahasiswa</Text>
        </Stack>
        <Form method="post">
          <Stack>
            <Input.Wrapper label="NIM" required withAsterisk>
              <Input name="nim" />
            </Input.Wrapper>
            <Input.Wrapper label="Nama" required withAsterisk>
              <Input name="nama" />
            </Input.Wrapper>
            <Input.Wrapper label="Tanggal Lahir" required withAsterisk>
              <Input name="tanggal_lahir" type="date" />
            </Input.Wrapper>
            <Input.Wrapper label="Alamat" required withAsterisk>
              <Input name="alamat" />
            </Input.Wrapper>
            <Group justify="flex-end">
              <Button type="submit">
                <IconPlus size={16} />
                Simpan
              </Button>
            </Group>
          </Stack>
        </Form>
      </Stack>
    </Container>
  );
}
