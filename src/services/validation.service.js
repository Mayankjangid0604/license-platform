import { db } from "../db/database.js";
import { APP_STATUS, LICENSE_STATUS, DENY_REASON, SERVER_ID } from "../config/constants.js";

export function validateLicense({ app_id, license_key, machine_id }) {
  const app = db.prepare(
    "SELECT * FROM apps WHERE app_id = ?"
  ).get(app_id);

  if (!app || app.status !== APP_STATUS.ACTIVE) {
    return deny(DENY_REASON.APP_DISABLED);
  }

  const license = db.prepare(
    "SELECT * FROM licenses WHERE license_key = ? AND app_id = ?"
  ).get(license_key, app_id);

  if (!license) {
    return deny(DENY_REASON.LICENSE_NOT_FOUND);
  }

  if (license.status === LICENSE_STATUS.REVOKED) {
    return deny(DENY_REASON.LICENSE_REVOKED);
  }

  if (license.status === LICENSE_STATUS.DISABLED) {
    return deny(DENY_REASON.LICENSE_DISABLED);
  }

  if (license.expires_at && Date.now() > Date.parse(license.expires_at)) {
    return deny(DENY_REASON.LICENSE_EXPIRED);
  }

  const machine = db.prepare(
    "SELECT * FROM machines WHERE license_key = ?"
  ).get(license_key);

  if (!machine) {
    db.prepare(
      "INSERT INTO machines (license_key, machine_id, bound_at) VALUES (?, ?, ?)"
    ).run(license_key, machine_id, new Date().toISOString());
    db.prepare(
      "UPDATE licenses SET last_validated_at = ? WHERE license_key = ?"
    ).run(new Date().toISOString(), license_key);
    return allow();
  }

  if (machine.machine_id !== machine_id) {
    return deny(DENY_REASON.MACHINE_MISMATCH);
  }

  db.prepare(
    "UPDATE licenses SET last_validated_at = ? WHERE license_key = ?"
  ).run(new Date().toISOString(), license_key);

  return allow();
}

function allow() {
  return {
    decision: "ALLOW",
    server_id: SERVER_ID,
    server_time: new Date().toISOString()
  };
}

function deny(reason) {
  return {
    decision: "DENY",
    reason,
    server_id: SERVER_ID,
    server_time: new Date().toISOString()
  };
}
