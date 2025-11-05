import type { Connection, ResultSetHeader } from "mysql2/promise";
import type { Magang } from "../model/Magang";

export class MagangRepository {
  db: Connection;

  constructor(db: Connection) {
    this.db = db;
  }

  async getAllMagang(): Promise<Magang[]> {
    const [rows] = await this.db.query("SELECT * FROM `magang`");
    const magang = rows as Magang[];

    // Fetch mahasiswa IDs for each magang
    for (const m of magang) {
      const [mahasiswaRows] = await this.db.query(
        "SELECT mahasiswa_id FROM `magang_mahasiswa` WHERE magang_id = ?",
        [m.id],
      );
      m.mahasiswa_ids = (mahasiswaRows as any[]).map((row) => row.mahasiswa_id);
    }

    return magang;
  }

  async getMagangById(id: number): Promise<Magang | null> {
    const [rows] = await this.db.query("SELECT * FROM `magang` WHERE id = ?", [
      id,
    ]);
    const magang = rows as Magang[];

    if (magang.length === 0) {
      return null;
    }

    // Fetch mahasiswa IDs
    const [mahasiswaRows] = await this.db.query(
      "SELECT mahasiswa_id FROM `magang_mahasiswa` WHERE magang_id = ?",
      [id],
    );
    magang[0].mahasiswa_ids = (mahasiswaRows as any[]).map(
      (row) => row.mahasiswa_id,
    );

    return magang[0];
  }

  async createMagang(
    magang: Omit<Magang, "id">,
    mahasiswaIds: number[] = [],
  ): Promise<Magang> {
    const sql =
      "INSERT INTO `magang` (`nama`, `lokasi`, `dosen_pembimbing_id`, `tanggal_mulai`, `tanggal_selesai`) VALUES (?, ?, ?, ?, ?)";
    const values = [
      magang.nama,
      magang.lokasi,
      magang.dosen_pembimbing_id,
      magang.tanggal_mulai,
      magang.tanggal_selesai,
    ];

    const [result] = await this.db.execute(sql, values);
    const insertResult = result as ResultSetHeader;
    const magangId = insertResult.insertId;

    // Insert mahasiswa relationships
    if (mahasiswaIds.length > 0) {
      const junctionSql =
        "INSERT INTO `magang_mahasiswa` (`magang_id`, `mahasiswa_id`) VALUES (?, ?)";
      for (const mahasiswaId of mahasiswaIds) {
        await this.db.execute(junctionSql, [magangId, mahasiswaId]);
      }
    }

    return {
      id: magangId,
      ...magang,
      mahasiswa_ids: mahasiswaIds,
    };
  }

  async updateMagang(
    magangId: number,
    magang: Omit<Magang, "id">,
    mahasiswaIds: number[] = [],
  ): Promise<Magang> {
    const sql =
      "UPDATE `magang` SET `nama` = ?, `lokasi` = ?, `dosen_pembimbing_id` = ?, `tanggal_mulai` = ?, `tanggal_selesai` = ? WHERE id = ?";
    const values = [
      magang.nama,
      magang.lokasi,
      magang.dosen_pembimbing_id,
      magang.tanggal_mulai,
      magang.tanggal_selesai,
      magangId,
    ];

    await this.db.execute(sql, values);

    // Delete existing mahasiswa relationships
    await this.db.execute(
      "DELETE FROM `magang_mahasiswa` WHERE magang_id = ?",
      [magangId],
    );

    // Insert new mahasiswa relationships
    if (mahasiswaIds.length > 0) {
      const junctionSql =
        "INSERT INTO `magang_mahasiswa` (`magang_id`, `mahasiswa_id`) VALUES (?, ?)";
      for (const mahasiswaId of mahasiswaIds) {
        await this.db.execute(junctionSql, [magangId, mahasiswaId]);
      }
    }

    return {
      id: magangId,
      ...magang,
      mahasiswa_ids: mahasiswaIds,
    };
  }

  async deleteMagang(id: number): Promise<void> {
    // The junction table entries will be deleted automatically due to ON DELETE CASCADE
    const sql = "DELETE FROM `magang` WHERE id = ?";
    await this.db.execute(sql, [id]);
  }

  async addMahasiswaToMagang(
    magangId: number,
    mahasiswaId: number,
  ): Promise<void> {
    const sql =
      "INSERT INTO `magang_mahasiswa` (`magang_id`, `mahasiswa_id`) VALUES (?, ?)";
    await this.db.execute(sql, [magangId, mahasiswaId]);
  }

  async removeMahasiswaFromMagang(
    magangId: number,
    mahasiswaId: number,
  ): Promise<void> {
    const sql =
      "DELETE FROM `magang_mahasiswa` WHERE magang_id = ? AND mahasiswa_id = ?";
    await this.db.execute(sql, [magangId, mahasiswaId]);
  }

  async getMahasiswaByMagangId(magangId: number): Promise<number[]> {
    const [rows] = await this.db.query(
      "SELECT mahasiswa_id FROM `magang_mahasiswa` WHERE magang_id = ?",
      [magangId],
    );
    return (rows as any[]).map((row) => row.mahasiswa_id);
  }
}
