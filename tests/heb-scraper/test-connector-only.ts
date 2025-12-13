import { HEBBrowsingConnector } from './src/connectors/web';

async function testConnector() {
  console.log('🧪 Testing HEB Connector directly\n');

  const connector = new HEBBrowsingConnector();

  const testIngredients = ['chicken breast', 'broccoli'];

  console.log(`Testing with ${testIngredients.length} ingredients: ${testIngredients.join(', ')}\n`);

  try {
    const result = await connector.execute({ ingredients: testIngredients });

    console.log('\n📊 RESULTS:');
    console.log(JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('\n✅ Connector succeeded!');
      const foundCount = result.results.filter((r: any) => r.found).length;
      console.log(`Found ${foundCount}/${testIngredients.length} ingredients`);
    } else {
      console.log('\n❌ Connector failed:', result.error);
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error);
  } finally {
    await connector.cleanup();
  }
}

testConnector()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
