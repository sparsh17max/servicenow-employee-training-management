// Run in the browser console while logged in to the instance (uses the session + g_ck token).
// Uploads a PNG (base64) as the image of a db_image record via the Attachment REST API.
// GlideSysAttachment.writeBase64() from Scripts - Background returned undefined on this release,
// so the REST API from an authenticated browser session was used instead.
async function uploadLogo(dbImageName, base64Png) {
  const tok = window.g_ck;
  const q = await fetch('/api/now/table/db_image?sysparm_query=name=' + dbImageName + '&sysparm_fields=sys_id', {headers: {'X-UserToken': tok, 'Accept': 'application/json'}}).then(r => r.json());
  const id = q.result[0].sys_id;
  const bin = atob(base64Png); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  const res = await fetch('/api/now/attachment/file?table_name=ZZ_YYdb_image&table_sys_id=' + id + '&file_name=image',
    {method: 'POST', headers: {'X-UserToken': tok, 'Content-Type': 'image/png', 'Accept': 'application/json'}, body: new Blob([u], {type: 'image/png'})}).then(r => r.json());
  await fetch('/api/now/table/db_image/' + id, {method: 'PATCH', headers: {'X-UserToken': tok, 'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify({image: res.result.sys_id, format: 'png'})});
  return res.result.sys_id;
}
// uploadLogo('novatrix-header.png', '<base64 of brand/novatrix-header.png>');
