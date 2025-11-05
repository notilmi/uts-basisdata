import * as React from "react";
import type { Route } from "./+types/TambahDosenPage";
import {
  Button,
  Container,
  Group,
  Input,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Form } from "react-router";
import { IconChevronLeft, IconPlus } from "@tabler/icons-react";
import { $dbconn } from "~/lib/db";
import { DosenRepository } from "~/persistence/repository/DosenRepository";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router";

type TambahDosenProps = Route.ComponentProps;

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const db = await $dbconn;
  const dosenRepository = new DosenRepository(db);

  const result = await dosenRepository.createDosen({
    nip: formData.get("nip") as string,
    nama: formData.get("nama") as string,
  });

  return result;
}

export default function TambahDosen({ actionData }: TambahDosenProps) {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (actionData) {
      notifications.show({
        title: "Berhasil menambahkan dosen",
        message: "Dosen berhasil ditambahkan",
        color: "green",
      });
      // Navigate back to dosen list after successful creation
      setTimeout(() => {
        navigate("/dosen");
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
          <Title order={2}>Tambah Dosen</Title>
          <Text>Tambah data dosen</Text>
        </Stack>
        <Form method="post">
          <Stack>
            <Input.Wrapper label="NIP" required withAsterisk>
              <Input name="nip" />
            </Input.Wrapper>
            <Input.Wrapper label="Nama" required withAsterisk>
              <Input name="nama" />
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
