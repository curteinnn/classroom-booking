const readline = require("readline");
const bcrypt = require("bcrypt");
const db = require("../src/config/database");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  try {
    const password = await new Promise((resolve) => {
      rl.question("Masukkan password awal admin: ", resolve);
    });

    if (Buffer.byteLength(password, "utf8") < 12) {
      throw new Error("Password minimal 12 byte.");
    }

    if (Buffer.byteLength(password, "utf8") > 72) {
      throw new Error("Password maksimal 72 byte.");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      `UPDATE users
       SET password_hash = ?,
           is_active = 1,
           email_verified_at = COALESCE(email_verified_at, NOW())
       WHERE identifier = ?
         AND role = 'admin'`,
      [passwordHash, "admin01"],
    );

    if (result.affectedRows !== 1) {
      throw new Error(
        "Akun admin01 tidak ditemukan atau tidak berhasil diperbarui.",
      );
    }

    console.log("Password awal admin berhasil disimpan.");
  } catch (error) {
    console.error("Gagal:", error.message);
    process.exitCode = 1;
  } finally {
    rl.close();
    await db.end();
  }
}

main();
