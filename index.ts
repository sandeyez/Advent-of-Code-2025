import { days } from "./days";
import { z } from "zod";
import invariant from "tiny-invariant";
import { readFileForDay } from "./utils/import";
import { formatTerminalLine, getTerminalLineLength } from "./utils/terminal";

/*
The run function supports the following arguments:
* --day=<day> - The day to run (by default the last day is ran)
* --part=<part> - The part to run (by default part 1 and 2 are ran, use 1 or 2 to run only one part)
*/
async function run() {
  const argString = process.argv.slice(2);

  let args: Partial<{ day: string; part: string }> = {};

  for (const arg of argString) {
    if (arg.startsWith("--day=")) {
      args.day = arg.split("=").at(1);
    }
    if (arg.startsWith("--part=")) {
      args.part = arg.split("=").at(1);
    }
  }

  const res = zSchema.safeParse(args);

  if (!res.success) {
    const { errors, properties } = z.treeifyError(res.error);

    const messages = [
      ...errors,
      Object.values(properties ?? {}).flatMap(({ errors }) => errors),
    ].flat();

    console.error(messages.at(0) ?? "An unknown error occurred");
    process.exit(1);
  }

  const { day, part } = res.data;

  invariant(
    dayHasModule(day),
    `Day ${day} is not found in the days/index.ts file`
  );

  const { part1, part2 } = days[day];

  const terminalHeader = `|        🎅 2025 ADVENT OF CODE 🎁        |`;
  const lineLength = getTerminalLineLength(terminalHeader);
  const dayHeader = formatTerminalLine(`RUNNING DAY ${day}...`, lineLength);

  const separator = "-".repeat(lineLength);

  console.log(separator);
  console.log(terminalHeader);
  console.log(separator);
  console.log(dayHeader);
  console.log(formatTerminalLine("", lineLength));

  const timer = performance.now();
  const input = readFileForDay(day);
  const duration = performance.now() - timer;

  console.log(
    formatTerminalLine(
      `Input read (${input.length} ${
        input.length === 1 ? "line" : "lines"
      }) in ${duration.toFixed(2)}ms`,
      lineLength
    )
  );

  console.log(formatTerminalLine("", lineLength));

  console.log(formatTerminalLine("Part 1:", lineLength));

  if (part.includes(1)) {
    const timer = performance.now();
    const result = part1(input);
    const duration = performance.now() - timer;
    console.log(
      formatTerminalLine(`✅ ${result} (${duration.toFixed(2)}ms)`, lineLength)
    );
  } else {
    console.log(formatTerminalLine("⏭️ Skipped", lineLength));
  }

  console.log(formatTerminalLine("", lineLength));

  console.log(formatTerminalLine("Part 2:", lineLength));

  if (part.includes(2)) {
    const timer = performance.now();
    const result = part2(input);
    const duration = performance.now() - timer;

    console.log(
      formatTerminalLine(`✅ ${result} (${duration.toFixed(2)}ms)`, lineLength)
    );
  } else {
    console.log(formatTerminalLine("⏭️ Skipped", lineLength));
  }

  console.log(separator);
}

const zSchema = z.object({
  day: z
    .string()
    .default(() => Object.keys(days).at(-1)?.toString() ?? "1")
    .transform((value) => Number(value))
    .refine(
      (value) => value in days,
      "This day is not found in the days/index.ts file"
    ),
  part: z
    .string()
    .default("1,2")
    .transform((value) => value.split(",").map(Number))
    .refine(
      (value) => value.every((value) => value === 1 || value === 2),
      "Parts must be either 1 or 2"
    ),
});

function dayHasModule(day: number): day is keyof typeof days {
  return day in days;
}

run();
