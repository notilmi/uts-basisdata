import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layout/AppLayout/AppLayout.tsx", [
    route("mahasiswa", "pages/DaftarMahasiswaPage/DaftarMahasiswaPage.tsx"),
    route(
      "mahasiswa/tambah",
      "pages/TambahMahasiswaPage/TambahMahasiswaPage.tsx",
    ),
    route("dosen", "pages/DaftarDosenPage/DaftarDosenPage.tsx"),
    route("dosen/tambah", "pages/TambahDosenPage/TambahDosenPage.tsx"),
    route("magang", "pages/DaftarMagangPage/DaftarMagangPage.tsx"),
    route("magang/tambah", "pages/TambahMagangPage/TambahMagangPage.tsx"),
    route("magang/edit/:id", "pages/EditMagangPage/EditMagangPage.tsx"),
  ]),
] satisfies RouteConfig;
