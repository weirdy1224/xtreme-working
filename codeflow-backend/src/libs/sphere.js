import fetch from 'node-fetch';

const SPHERE_ENDPOINT = process.env.SPHERE_ENGINE_ENDPOINT;
const SPHERE_TOKEN = process.env.SPHERE_ENGINE_TOKEN;

// Map Sphere Engine status codes
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

// Submit a single execution
async function submitOne(source_code, compilerId, stdin) {
  console.log("Submitting code to Sphere Engine:", { compilerId, source_code, stdin });

  const response = await fetch(`${SPHERE_ENDPOINT}/submissions?wait=true`, {
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

  const text = await response.text();
  if (!response.ok) {
    console.error("Sphere Engine submit failed:", text);
    throw new Error(`Sphere Engine submit failed: ${response.status} ${text}`);
  }

  const data = JSON.parse(text);
  console.log("Sphere Engine submit response:", data);

  return { token: data.id, result: data.result };
}

// Batch submit (sequential to avoid 404)
async function submitBatch(submissions) {
  console.log("Submitting batch to Sphere Engine:", submissions.length);
  const results = [];

  for (const sub of submissions) {
    const res = await submitOne(sub.source_code, sub.language_id, sub.stdin ?? "");
    results.push(res);
  }

  console.log("Tokens:", results.map(r => r.token));
  return results;
}

// Poll batch results (just maps the results from wait=true)
async function pollBatchResults(tokens) {
  return tokens.map(t => {
    const res = t.result || {};
    const streams = res.streams || {};

    // Stream can be object or array
    const getContent = (stream) => {
      if (!stream) return null;
      if (Array.isArray(stream)) return stream[0]?.content?.trim() || null;
      return stream.content?.trim() || null;
    };

    return {
      stdout: getContent(streams.output),
      stderr: getContent(streams.stderr),
      compile_output: getContent(streams.cmpinfo),
      status: { description: getStatusDescription(res.status?.code) },
      memory: res.memory ? res.memory / 1024 : null,
      time: res.time ?? null,
    };
  });
}

// Map compiler ID to language name
function getLanguageName(compilerId) {
  const map = { 116: "Python 3", 10: "Java", 1: "C", 41: "C++" };
  return map[compilerId] || "Unknown";
}

export { getLanguageName, submitBatch, pollBatchResults };
