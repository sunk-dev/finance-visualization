import * as fs from 'fs';
import * as path from 'path';
import { parseStringPromise } from 'xml2js';

interface CorpData {
  c: string; // corp_code
  n: string; // corp_name
  e: string; // corp_eng_name
  s: string; // stock_code
}

async function parseCorpXml() {
  try {
    const corpXmlPath = path.join(process.cwd(), 'corp.xml');
    const xmlContent = fs.readFileSync(corpXmlPath, 'utf-8');

    const parsed = await parseStringPromise(xmlContent, {
      mergeAttrs: true,
      ignoreAttrs: true,
      explicitArray: false,
    });

    const corpList = Array.isArray(parsed.result.list)
      ? parsed.result.list
      : [parsed.result.list];

    const corpData: CorpData[] = corpList.map(
      (item: {
        corp_code: string;
        corp_name: string;
        corp_eng_name: string;
        stock_code: string;
      }) => ({
        c: item.corp_code,
        n: item.corp_name,
        e: item.corp_eng_name,
        s: item.stock_code,
      })
    );

    const outputPath = path.join(process.cwd(), 'public', 'corp_data.json');
    fs.writeFileSync(outputPath, JSON.stringify(corpData), 'utf-8');

    console.log(`✓ Parsed ${corpData.length} corporations`);
    console.log(`✓ Saved to ${outputPath}`);
  } catch (error) {
    console.error('Error parsing corp.xml:', error);
    process.exit(1);
  }
}

parseCorpXml();
