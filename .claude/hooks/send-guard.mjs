import { readFileSync } from "node:fs";

const BLOCKED_TOOLS = new Set([
  "send-broadcast",
  "create-automation",
  "send-inbox-draft",
  "send-new-inbox-email",
]);

function block(reason) {
  console.error(`Blocked: ${reason}`);
  process.exit(2);
}

function normalizeAddress(value) {
  let text = String(value ?? "").trim();
  const angle = text.match(/<([^<>]+)>/);
  if (angle) text = angle[1];
  text = text.replace(/^\[|\]$/g, "").trim().toLowerCase();
  return text;
}

function collectAddresses(value, out) {
  if (value == null) return;
  if (Array.isArray(value)) {
    for (const item of value) collectAddresses(item, out);
    return;
  }
  if (typeof value === "object") {
    const candidate = value.email ?? value.address ?? value.value;
    if (candidate != null) collectAddresses(candidate, out);
    return;
  }
  if (typeof value !== "string") return;
  for (const part of value.split(/[,;]/)) {
    const text = part.trim();
    if (text) out.push(text);
  }
}

let input;
try {
  input = JSON.parse(readFileSync(0, "utf8"));
} catch {
  block("could not read the tool call.");
}

const toolName = typeof input?.tool_name === "string" ? input.tool_name : "";
const action = toolName.split("__").pop() ?? "";
const toolInput = input?.tool_input ?? {};

if (BLOCKED_TOOLS.has(action)) {
  block(`${action} can reach a whole list of people.`);
}

if (action === "send-email" || action === "send-batch-emails") {
  const addresses = [];
  for (const field of ["to", "cc", "bcc"]) {
    collectAddresses(toolInput[field], addresses);
  }

  const ownEmail = normalizeAddress(process.env.MY_EMAIL);

  for (const raw of addresses) {
    const address = normalizeAddress(raw);
    if (!address) {
      block(`"${raw}" is not a valid email address.`);
    }

    const allowed =
      address.endsWith("@resend.dev") || (ownEmail !== "" && address === ownEmail);

    if (!allowed) {
      block(`"${address}" is not @resend.dev or MY_EMAIL.`);
    }
  }
}

process.exit(0);
