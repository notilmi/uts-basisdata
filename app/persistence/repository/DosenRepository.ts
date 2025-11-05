import type { Connection, ResultSetHeader } from "mysql2/promise";
import type { Dosen } from "../model/Dosen";

export class DosenRepository {
  db: Connection;

  constructor(db: Connection) {
    this.db = db;
  }

  async getAllDosen(): Promise<Dosen[]> {
    const [rows] = await this.db.query("SELECT * FROM `dosen`");
    return rows as Dosen[];
  }

  async createDosen(dosen: Omit<Dosen, "id">): Promise<Dosen> {
    const sql = "INSERT INTO `dosen` (`nama`, `nip`) VALUES (?, ?)";
    const values = [dosen.nama, dosen.nip];

    const [result] = await this.db.execute(sql, values);
    const insertResult = result as ResultSetHeader;

    return {
      id: insertResult.insertId,
      ...dosen,
    };
  }

  async updateDosen(id: number, dosen: Omit<Dosen, "id">): Promise<Dosen> {
    const sql = "UPDATE `dosen` SET `nama` = ?, `nip` = ? WHERE id = ?";
    const values = [dosen.nama, dosen.nip, id];

    await this.db.execute(sql, values);

    return {
      id,
      ...dosen,
    };
  }

  async deleteDosen(id: number): Promise<void> {
    const sql = "DELETE FROM `dosen` WHERE id = ?";
    await this.db.execute(sql, [id]);
  }
}
