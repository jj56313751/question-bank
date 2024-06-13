import db from '../../../db/index'

export async function fetchBanks() {
  try {
    const [rows] = await db.query(`
    SELECT * FROM banks
  `)
    return rows
  } catch (err) {
    return err
  }
}
