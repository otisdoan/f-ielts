// Test single listening test API endpoint
const testId = '0b2467d6-1725-45b7-b4a2-7a907fc833f2';

console.log('🧪 Testing Single Listening Test API...\n');
console.log(`Fetching test: ${testId}\n`);

fetch(`http://localhost:3000/api/listening-tests/${testId}`)
  .then(res => {
    console.log(`Status: ${res.status} ${res.statusText}\n`);
    return res.json();
  })
  .then(json => {
    if (json.data) {
      console.log('✅ API Working!\n');
      console.log(`Title: ${json.data.title}`);
      console.log(`ID: ${json.data.id}`);
      console.log(`Band: ${json.data.targetBand}`);
      console.log(`Duration: ${json.data.duration} mins`);
      console.log(`Parts: ${json.data.parts?.length || 0}`);
      console.log(`Published: ${json.data.isPublished ? '✅ Yes' : '❌ No'}`);
    } else if (json.error) {
      console.log('❌ API Error:');
      console.log(json.error);
    }
  })
  .catch(err => {
    console.error('❌ Request failed:', err.message);
  });
