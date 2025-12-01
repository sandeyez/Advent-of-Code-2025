import fs from "fs";

export function readFileForDay(day: number): string[] {
  const path = `./days/day-${day.toString().padStart(2, "0")}/input.txt`;

  const file = fs.readFileSync(path, "utf8");

  return file.split("\n");
}
