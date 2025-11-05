import type { Connection, ResultSetHeader } from "mysql2/promise";
import type { Mahasiswa } from "../model/Mahasiswa";

export class MahasiswaRepository {
  db: Connection;

  constructor(db: Connection) {
    this.db = db;
  }

  async getAllMahasiswa(): Promise<Mahasiswa[]> {
    const [rows] = await this.db.query("SELECT * FROM `mahasiswa`");
    return rows as Mahasiswa[];
  }

  async createMahasiswa(mahasiswa: Omit<Mahasiswa, "id">): Promise<Mahasiswa> {
    const sql =
      "INSERT INTO `mahasiswa` (`nim`, `nama`, `tanggal_lahir`, `alamat`) VALUES (?, ?, ?, ?)";
    const values = [
      mahasiswa.nim,
      mahasiswa.nama,
      mahasiswa.tanggal_lahir,
      mahasiswa.alamat,
    ];

    const [result] = await this.db.execute(sql, values);
    const insertResult = result as ResultSetHeader;

    return {
      id: insertResult.insertId,
      ...mahasiswa,
    };
  }

  async updateMahasiswa(
    mahasiswaId: number,
    mahasiswa: Omit<Mahasiswa, "id">,
  ): Promise<Mahasiswa> {
    const sql =
      "UPDATE `mahasiswa` SET `nim` = ?, `nama` = ?, `tanggal_lahir` = ?, `alamat` = ? WHERE id = ?";
    const values = [
      mahasiswa.nim,
      mahasiswa.nama,
      mahasiswa.tanggal_lahir,
      mahasiswa.alamat,
      mahasiswaId,
    ];

    await this.db.execute(sql, values);

    return {
      id: mahasiswaId,
      ...mahasiswa,
    };
  }

  async deleteMahasiswa(id: number): Promise<void> {
    const sql = "DELETE FROM `mahasiswa` WHERE id = ?";
    await this.db.execute(sql, [id]);
  }
}
