import { inspectSetup } from "../lib/setup/checks.mjs";

const report = await inspectSetup(process.env);
console.log("Sonda · Verificação de configuração (somente leitura)\n");
for (const item of report.checks)
  console.log(`[${item.state.toUpperCase()}] ${item.message}`);
console.log("\nValidação real ainda necessária:");
for (const item of report.manual) console.log(`- ${item}`);
console.log(
  "\nEste relatório não habilita login, não aplica migrations e não conclui a milestone.",
);
process.exitCode = report.exitCode;
