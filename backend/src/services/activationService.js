const crypto = require("crypto");
const db = require("../config/database");
const { sendActivationEmail } = require("./emailService");

async function createActivation(userId, email) {
  const baseUrl = process.env.APP_BASE_URL;

  if (!baseUrl) {
    throw new Error("APP_BASE_URL belum dikonfigurasi.");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      `UPDATE account_activation_tokens
       SET used_at = NOW()
       WHERE user_id = ? AND used_at IS NULL`,
      [userId],
    );

    await connection.execute(
      `INSERT INTO account_activation_tokens
       (user_id, token_hash, expires_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE))`,
      [userId, tokenHash],
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  const activationUrl = `${baseUrl.replace(/\/+$/, "")}/activate?token=${encodeURIComponent(token)}`;

  try {
    await sendActivationEmail(email, activationUrl);
  } catch (error) {
    // Email gagal dikirim: batalkan token yang baru dibuat.
    await db.execute(
      `UPDATE account_activation_tokens
       SET used_at = NOW()
       WHERE token_hash = ? AND used_at IS NULL`,
      [tokenHash],
    );

    throw error;
  }
}

module.exports = { createActivation };
