import { test } from '@playwright/test';
import { parse } from 'csv-parse/.';
import * as fs from 'fs';
import * as path from 'path';
// Install csv-parse from npm
const records = parse(fs.readFileSync(path.join(__dirname, 'input.csv')), {
  columns: true,
  skip_empty_lines: true
});
records.forEach((record)=>{
  test(`foo: ${record.test_case}`, async ({ page }) => {
    console.log(record.test_case, record.some_value, record.some_other_value);
  });
});
