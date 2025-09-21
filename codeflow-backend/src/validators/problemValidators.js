import { body } from "express-validator";

const problemValidator = () => [
  body("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),

  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("difficulty")
    .isIn(["EASY", "MEDIUM", "HARD"])
    .withMessage("Difficulty must be EASY, MEDIUM, or HARD"),

  body("tags")
    .isArray({ min: 1 })
    .withMessage("At least one tag is required")
    .custom((tags) => {
      if (!Array.isArray(tags)) throw new Error("Tags must be an array");
      if (!tags.every((tag) => typeof tag === "string" && tag.trim().length > 0)) {
        throw new Error("All tags must be non-empty strings");
      }
      return true;
    }),

  // Make constraints optional unless you add it to the form
  body("constraints")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Constraints must not be empty"),

  body("examples")
    .isArray()
    .withMessage("Examples must be an array")
    .custom((examples) => {
      if (!Array.isArray(examples)) throw new Error("Examples must be an array");
      const len = examples.length;
      if (len < 2 || len > 3) {
        throw new Error("Provide between 2 and 3 examples in total");
      }
      for (const ex of examples) {
        if (!ex || typeof ex !== "object") throw new Error("Each example must be an object");
        if (typeof ex.input !== "string") throw new Error("Example input must be a string");
        if (typeof ex.output !== "string" || ex.output.trim().length === 0) {
          throw new Error("Example output must be a non-empty string");
        }
      }
      return true;
    }),

  body("publicTestcases")
    .isArray()
    .withMessage("publicTestcases must be an array")
    .custom((tcs) => {
      if (!Array.isArray(tcs)) throw new Error("publicTestcases must be an array");
      if (tcs.length !== 3) throw new Error("Exactly 3 public testcases are required");
      for (const tc of tcs) {
        if (!tc || typeof tc !== "object") throw new Error("Each public testcase must be an object");
        if (typeof tc.input !== "string") throw new Error("Testcase input must be a string");
        if (typeof tc.output !== "string" || tc.output.trim().length === 0) {
          throw new Error("Testcase output must be a non-empty string");
        }
      }
      return true;
    }),

  body("hiddenTestcases")
    .optional()
    .isArray()
    .withMessage("hiddenTestcases must be an array")
    .custom((tcs) => {
      for (const tc of tcs) {
        if (!tc || typeof tc !== "object") throw new Error("Each hidden testcase must be an object");
        if (typeof tc.input !== "string") throw new Error("Hidden testcase input must be a string");
        if (typeof tc.output !== "string" || tc.output.trim().length === 0) {
          throw new Error("Hidden testcase output must be a non-empty string");
        }
      }
      return true;
    }),

  // Accept object OR array of snippets (flexibility)
  body("codeSnippets").custom((cs) => {
    if (Array.isArray(cs)) {
      for (const snip of cs) {
        if (!snip.language || !snip.code) {
          throw new Error("Each code snippet must include language and code");
        }
      }
      return true;
    }

    if (typeof cs !== "object" || cs === null) {
      throw new Error("codeSnippets must be an object or array");
    }

    const required = ["PYTHON", "JAVA", "C", "CPP"];
    const missing = required.filter((r) => !Object.keys(cs).includes(r));
    if (missing.length) throw new Error(`Missing snippets: ${missing.join(", ")}`);

    for (const lang of required) {
      if (typeof cs[lang] !== "string" || cs[lang].trim().length === 0) {
        throw new Error(`${lang} snippet must be a non-empty string`);
      }
    }
    return true;
  }),
];

export { problemValidator };
