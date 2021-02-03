const path = require('path');
const chalk = require('chalk');
const fse = require('fs-extra');
const { chromium } = require('playwright');

const DataModes = [
	'% Collected',
	'Appointment Type',
	'Billing Method',
	'Clinician Name',
	'Month',
	'Patient Name',
	'Primary Insurer Name',
	'Secondary Insurer Name',
	'Service Description',
	'Write Offs',
];

(async () => {
	const browser = await chromium.launch({
		downloadsPath: __dirname,
	});
	const context = await browser.newContext();

	const page = await context.newPage();
	await page.goto('http://localhost:8080');
	await page.evaluate(() => window.iAmHeadless());

	const tnsBtnSel = '.therapy_notes_spreadsheet .card-body a:first-of-type';
	const [fileChooser] = await Promise.all([
		page.waitForEvent('filechooser'),
		page.click(tnsBtnSel),
	]);
	await fileChooser.setFiles(
		path.resolve(__dirname, 'sample-data/TestData.xlsx')
	);

	let err = false;
	for (const mode of DataModes) {
		try {
			await testModeResults(page, mode);
		} catch (e) {
			console.log(chalk.redBright(e.message));
			err = true;
		}
	}
	if (err) console.log(chalk.bold('Use --save to save incorrect result files'));
	else console.log(chalk.greenBright('Passed'));

	await browser.close();
})();

async function saveModeResults(page, mode) {
	await page.selectOption('select#mode', mode);

	await page.click('button#download-results');
	const results = await page.evaluate(() => window.result);

	await fse.writeFile(`sample-data/results/${mode}.csv`, results, {
		encoding: 'utf8',
	});
}

async function testModeResults(page, mode) {
	// switch to data mode
	await page.selectOption('select#mode', mode);

	await page.click('button#download-results');
	const results = await page.evaluate(() => window.result);

	const expectedResults = await fse.readFile(
		path.resolve(__dirname, `sample-data/results/${mode}.csv`),
		'utf8'
	);

	if (!results) {
		throw new Error('No results were returned from page');
	}
	if (results.trim() !== expectedResults.trim()) {
		let msg = `${mode} results do not match expected results`;

		if (process.argv.includes('--save')) {
			await fse.writeFile(`debug-${mode}.csv`, results, { encoding: 'utf8' });
			msg += ` (Results file written to debug-${mode}.csv)`;
		}

		throw new Error(msg);
	}
}
