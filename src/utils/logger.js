export function log(event, meta = {}) {
  console.log(
    JSON.stringify({
      time: new Date().toISOString(),
      event,
      ...meta
    })
  );
}
