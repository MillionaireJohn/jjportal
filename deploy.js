const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("\n🍋 JJ Portal Deploy Script");
console.log("==========================\n");

// Look for new index.html in Downloads or same folder
const possibleSources = [
  path.join(__dirname, "new_index.html"),
  path.join(require("os").homedir(), "Downloads", "JJPortal.html"),
  path.join(require("os").homedir(), "Downloads", "index.html"),
];

let copied = false;
for (const src of possibleSources) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(__dirname, "index.html"));
    console.log(`✅ Found and copied: ${src}`);
    // Clean up new_index.html if that's what we used
    if (src === path.join(__dirname, "new_index.html")) {
      fs.unlinkSync(src);
    }
    copied = true;
    break;
  }
}

if (!copied) {
  console.log("ℹ️  No new file found — pushing current index.html as-is.\n");
}

// Git push
try {
  console.log("📦 Adding files...");
  execSync("git add .", { stdio: "inherit" });

  const timestamp = new Date().toLocaleString("en-MY");
  console.log("💬 Committing...");
  execSync(`git commit -m "update ${timestamp}"`, { stdio: "inherit" });

  console.log("🚀 Pushing to GitHub...");
  execSync("git push", { stdio: "inherit" });

  console.log("\n✅ Done! Cloudflare will auto-deploy in ~30 seconds.");
  console.log("🌐 Your site: https://jjningjiportal.pages.dev\n");
} catch (e) {
  if (e.message.includes("nothing to commit")) {
    console.log("\n⚠️  Nothing changed — no push needed.");
  } else {
    console.error("\n❌ Error:", e.message);
  }
}
