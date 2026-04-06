/** Subset of \`waterfall help -o json\` used by the static site (schema v1). */

export type CliHelpJsonGlobalOption = {
  long: string;
  short?: string;
  metavar?: string;
  type: string;
  enumValues?: string[];
  description: string;
  default?: string;
  env?: string;
  dotWaterfallKey?: string;
};

export type CliHelpJsonPositional = {
  name: string;
  required: boolean;
  description: string;
};

export type CliHelpJsonCommandOption = {
  long: string;
  short?: string;
  type: string;
  description: string;
};

export type CliHelpJsonDotWaterfallKnownKey = {
  keys: string[];
  valueType: string;
  enumValues?: string[];
  description: string;
  cliFlag?: string;
  env?: string;
};

export type CliHelpJsonDotWaterfall = {
  description: string;
  syntax: { format: string; quotedValues: string };
  files: { path: string; role: string }[];
  merge: string;
  knownKeys: CliHelpJsonDotWaterfallKnownKey[];
  booleanValues: string[];
  keyMatching: string;
  environmentPassthrough: { rule: string; examples: string[] };
};

export type CliHelpJsonEnvironmentVariable = {
  name: string;
  description: string;
  valueDescription?: string;
  cliFlag?: string;
  dotWaterfallKey?: string;
};

export type CliHelpJsonEnvironmentCategory = {
  id: string;
  title: string;
  description?: string;
  variables: CliHelpJsonEnvironmentVariable[];
};

export type CliHelpJsonEnvironment = {
  description: string;
  precedenceNote: string;
  categories: CliHelpJsonEnvironmentCategory[];
};

export type CliHelpJsonOperatorHint = {
  summary: string;
  modes: { id: string; description: string }[];
};

export type CliHelpJsonCommand = {
  id: string;
  argvPrefix: string[];
  usage: string;
  /** Argv after global options, space-separated (same as \`usage\`). */
  cliForm: string;
  example: string;
  summary: string;
  kind: string;
  requiresSpecRoot: boolean;
  /** Required git branch in the spec repo (or N/A); mirrors CLI \`git-branch-guards\`. */
  branchRequirement: string;
  positionals?: CliHelpJsonPositional[];
  commandOptions?: CliHelpJsonCommandOption[];
  promptFile?: string;
  orchestrationSteps?: string[];
};

export type CliHelpJson = {
  schemaVersion: number;
  name: string;
  title: string;
  globalOptions: CliHelpJsonGlobalOption[];
  config: {
    files: string[];
    precedence: string;
    notes: string[];
  };
  dotWaterfall: CliHelpJsonDotWaterfall;
  environment: CliHelpJsonEnvironment;
  operatorHint: CliHelpJsonOperatorHint;
  specResolution: string[];
  commands: CliHelpJsonCommand[];
};

export function parseCliHelpJson(raw: string): CliHelpJson {
  const j = JSON.parse(raw) as CliHelpJson;
  if (j.schemaVersion !== 1) {
    throw new Error(`Unsupported cli-help schemaVersion: ${j.schemaVersion}`);
  }
  if (!Array.isArray(j.globalOptions) || !Array.isArray(j.commands)) {
    throw new Error("Invalid cli-help JSON: missing globalOptions or commands");
  }
  if (!j.dotWaterfall || !Array.isArray(j.dotWaterfall.knownKeys)) {
    throw new Error("Invalid cli-help JSON: missing dotWaterfall");
  }
  if (!j.environment || !Array.isArray(j.environment.categories)) {
    throw new Error("Invalid cli-help JSON: missing environment");
  }
  if (!j.operatorHint || !Array.isArray(j.operatorHint.modes)) {
    throw new Error("Invalid cli-help JSON: missing operatorHint");
  }
  for (const cmd of j.commands) {
    if (typeof cmd.branchRequirement !== "string") {
      throw new Error(
        `Invalid cli-help JSON: command ${String(cmd.id)} missing branchRequirement`,
      );
    }
  }
  return j;
}
