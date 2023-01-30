import c from "ansi-colors";
import { loadingSpinner } from "./loading-spinner";
import { execAsync } from "./exec-async";
import { checkIfInsideRepo } from "./check-inside-repo";

export async function initializeGit({ appDir }: { appDir: string }) {
  let spinner;

  try {
    // Check git installed
    await execAsync("git --version", {
      cwd: appDir,
      encoding: "utf-8",
    });

    const continueInit = await checkIfInsideRepo(appDir);
    if (!continueInit) {
      return;
    }

    spinner = loadingSpinner().start("Initializing git...");

    const options = {
      cwd: appDir,
      stdio: "pipe",
    } as const;

    await execAsync("git init", options);
    await execAsync("git checkout -b main", options);
    spinner.text = "Git: Adding files...";
    await execAsync("git add -A", options);
    spinner.text = "Git: Making first commit...";
    await execAsync(
      'git commit -m "Initial commit from create-liveblocks-app"',
      options
    );
  } catch (err) {
    spinner?.fail(c.redBright.bold("Problem initializing git:"));
    console.log();
    console.log(err);
    console.log();
    process.exit(0);
  }

  spinner?.succeed(c.green("Git initialized!"));
}