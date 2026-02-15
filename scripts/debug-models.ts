
import { loadModelCatalog } from "../src/agents/model-catalog.js";

async function main() {
  try {
    const models = await loadModelCatalog({ useCache: false });
    const providers = Array.from(new Set(models.map(m => m.provider)));
    
    console.log(JSON.stringify({
        count: models.length,
        providers: providers,
        googleModels: models.filter(m => m.provider.includes("google") || m.provider.includes("gemini")).map(m => ({id: m.id, provider: m.provider}))
    }, null, 2));

  } catch (error) {
    console.error("Error loading catalog:", error);
  }
}

main();
