# Builtin plugins (dsh-m)

These packages are **first-party for DHS-M**. `install/dsh-m-install.sh` links every entry in `manifest.json` with `"enabled": true` into the DSH install as `@custom/<name>` and registers them via the install-time cordis patch.

## Add a builtin

1. Create `harness/custom/builtins/<name>/` with `package.json` (`name: @custom/<name>`) and entry module.
2. Add it to `manifest.json` with `"enabled": true`.
3. If it needs cordis profile wiring beyond the generic patch, extend `scripts/apply-trust-all-patch.js` or a dedicated `scripts/register-builtins.js`.
4. Document in `contributors/docs/changes/NNN-….md`.

## Remove a builtin

Set `"enabled": false` in the manifest (keeps code) or delete the folder and manifest entry.

## Runtime patch vs source fork

Install applies the trust-all / provider patch **once**. Start scripts do not re-patch every boot (faster). A full source fork under `harness/src` remains optional for deeper upstream edits.
