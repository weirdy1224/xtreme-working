import fetch from 'node-fetch';

const SPHERE_ENDPOINT = process.env.SPHERE_ENGINE_ENDPOINT;
const SPHERE_TOKEN = process.env.SPHERE_ENGINE_TOKEN;

// Map Sphere Engine status codes → human-readable
function getStatusDescription(status) {
  switch (status) {
    case 15: return "Accepted";
    case 14: return "Wrong Answer";
    case 11: return "Compilation Error";
    case 12: return "Runtime Error";
    case 13: return "Time Limit Exceeded";
    case 17: return "Memory Limit Exceeded";
    case 19: return "Illegal System Call";
    case 20: return "Internal Error";
    case 0: return "In Queue";
    case 1: return "Compiling";
    case 2: return "Running";
    default: return "Unknown";
  }
}

// Debug log helper
function debugLog(prefix, data) {
  console.log(`🟢 [DEBUG] ${prefix}:`, JSON.stringify(data, null, 2));
}

// Submit a single execution to Sphere Engine
async function submitOne(source_code, compilerId, stdin) {
  debugLog('Submitting code', { compilerId, source_code, stdin });

  const response = await fetch(`${SPHERE_ENDPOINT}/submissions?wait=false`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SPHERE_TOKEN}`,
    },
    body: JSON.stringify({
      source: source_code,
      compilerId,
      input: stdin,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("🔥 Sphere Engine submit failed:", text);
    throw new Error(`Sphere Engine submit failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  debugLog('Sphere Engine submit response', data);

  return { token: data.id };
}

// Batch submit (sequentially)
async function submitBatch(submissions) {
  const results = [];
  for (const sub of submissions) {
    const res = await submitOne(sub.source_code, sub.language_id, sub.stdin ?? "");
    results.push(res);
  }
  debugLog('All submission tokens', results.map(r => r.token));
  return results;
}

// Fetch content from Sphere Engine stream URI
async function fetchStreamContent(uri) {
  if (!uri) return '';
  const res = await fetch(uri);
  if (!res.ok) return '';
  return (await res.text()).trim();
}

// Poll a single submission until complete
async function pollSubmission(token, interval = 1500, timeout = 30000) {
  const startTime = Date.now();

  while (true) {
    const response = await fetch(`${SPHERE_ENDPOINT}/submissions/${token}`, {
      headers: { Authorization: `Bearer ${SPHERE_TOKEN}` },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Sphere Engine poll failed: ${response.status} ${text}`);
    }

    const data = await response.json();
    const statusCode = data.result?.status?.code;

    if ([0, 1, 2].includes(statusCode)) {
      if (Date.now() - startTime > timeout) throw new Error("Sphere Engine polling timed out");
      await new Promise(r => setTimeout(r, interval));
      continue;
    }

    const streams = data.result?.streams || {};
    const stdout = await fetchStreamContent(streams.output?.uri);
    const stderr = await fetchStreamContent(streams.error?.uri);
    const compile_output = await fetchStreamContent(streams.cmpinfo?.uri);

    return {
      stdout,
      stderr,
      compile_output,
      status: { description: getStatusDescription(statusCode) },
      memory: data.result.memory ? `${data.result.memory / 1024} KB` : null,
      time: data.result.time ? `${data.result.time} s` : null,
    };
  }
}

// Poll batch of submissions
async function pollBatchResults(submitResponses) {
  const results = [];
  for (const s of submitResponses) {
    const result = await pollSubmission(s.token);
    results.push(result);
  }
  return results;
}

// Map compiler ID → Language name
function getLanguageName(compilerId) {
  const map = { 116: "Python 3", 10: "Java", 1: "C", 41: "C++" };
  return map[compilerId] || "Unknown";
}

export { getLanguageName, submitBatch, pollBatchResults, submitOne };
