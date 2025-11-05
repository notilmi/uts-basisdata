export interface Magang {
  id: number;
  nama: string;
  lokasi: string;
  dosen_pembimbing_id: number | null;
  tanggal_mulai: Date;
  tanggal_selesai: Date;
  mahasiswa_ids?: number[]; // Optional array for populated mahasiswa IDs from junction table
}
