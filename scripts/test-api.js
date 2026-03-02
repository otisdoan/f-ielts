const http = require("http");

function testAPI(endpoint) {
  return new Promise((resolve, reject) => {
    http
      .get(`http://localhost:3000${endpoint}`, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        });
      })
      .on("error", reject);
  });
}

async function main() {
  console.log("🧪 Testing Listening Tests API...\n");

  try {
    const response = await testAPI("/api/listening-tests");

    if (response.data && Array.isArray(response.data)) {
      console.log(`✅ API Working! Found ${response.data.length} test(s):\n`);

      response.data.forEach((test, index) => {
        console.log(`${index + 1}. ${test.title}`);
        console.log(`   ID: ${test.id}`);
        console.log(`   Band: ${test.targetBand}`);
        console.log(`   Duration: ${test.duration} mins`);
        console.log(`   Parts: ${test.parts?.length || 0}`);
        console.log(`   Published: ${test.isPublished ? "✅ Yes" : "❌ No"}`);
        console.log(
          `   Edit URL: http://localhost:3000/admin/listening-tests/edit/${test.id}\n`,
        );
      });
    } else if (response.error) {
      console.log(`❌ API Error: ${response.error}`);
    } else {
      console.log("⚠️  Unexpected response:", response);
    }
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.log("❌ Cannot connect to localhost:3000");
      console.log("   Make sure dev server is running: npm run dev\n");
    } else {
      console.log("❌ Error:", error.message);
    }
  }
}

main();
