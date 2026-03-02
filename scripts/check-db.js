const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Read .env file manually
const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const [key, ...valueParts] = line.split("=");
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join("=").trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log("🔍 Checking database status...\n");
  console.log(`📡 Connected to: ${supabaseUrl}\n`);

  const tables = [
    { name: "profiles", description: "User profiles" },
    { name: "reading_tests", description: "Reading practice tests" },
    { name: "listening_tests", description: "Listening practice tests" },
    { name: "writing_prompts", description: "Writing practice prompts" },
  ];

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table.name)
        .select("*", { count: "exact", head: true });

      if (error) {
        if (error.message.includes("does not exist")) {
          console.log(
            `❌ ${table.name.padEnd(20)} - NOT CREATED (${table.description})`,
          );
        } else {
          console.log(`⚠️  ${table.name.padEnd(20)} - ERROR: ${error.message}`);
        }
      } else {
        console.log(
          `✅ ${table.name.padEnd(20)} - EXISTS (${count || 0} rows)`,
        );
      }
    } catch (err) {
      console.log(`❌ ${table.name.padEnd(20)} - ERROR: ${err.message}`);
    }
  }

  console.log("\n📚 Next steps:");
  console.log(
    "   1. If any table shows ❌, run the migration in Supabase Dashboard",
  );
  console.log("   2. See DATABASE_SETUP.md for detailed instructions");
  console.log(
    "   3. For listening_tests, run: supabase/migrations/create_listening_tests.sql\n",
  );
}

checkDatabase()
  .catch(console.error)
  .finally(() => process.exit(0));
