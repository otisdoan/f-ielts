// Test speaking prompts API endpoint
console.log('🧪 Testing Speaking Prompts API...\n');

fetch('http://localhost:3000/api/speaking-prompts')
  .then(res => {
    console.log(`Status: ${res.status} ${res.statusText}\n`);
    return res.json();
  })
  .then(json => {
    if (json.data) {
      console.log(`✅ API Working! Found ${json.data.length} prompt(s):\n`);
      json.data.forEach((prompt, index) => {
        console.log(`${index + 1}. ${prompt.title}`);
        console.log(`   ID: ${prompt.id}`);
        console.log(`   Part: ${prompt.part}, Topic: ${prompt.topic}`);
        console.log(`   Band: ${prompt.targetBand}`);
        console.log(`   Prep: ${prompt.preparationTime}s, Speaking: ${Math.floor(prompt.speakingTime / 60)}m`);
        console.log(`   Published: ${prompt.isPublished ? '✅ Yes' : '❌ No'}`);
        console.log(`   Edit URL: http://localhost:3000/admin/speaking-prompts/edit/${prompt.id}`);
        console.log('');
      });
    } else if (json.error) {
      console.log('❌ API Error:');
      console.log(json.error);
    }
  })
  .catch(err => {
    console.error('❌ Request failed:', err.message);
  });
