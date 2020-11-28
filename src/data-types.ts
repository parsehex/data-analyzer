interface DataTypeConfig {
	version: number;
	name: string;
	name_long: string;
}
export const DataTypes: { [key: string]: DataTypeConfig } = {
	therapy_notes_spreadsheet: {
		version: 1,
		name: 'therapy_notes_spreadsheet',
		name_long: 'TherapyNotes Spreadsheet',
	},
};

export interface TherapyNotesColumn {
	'Appointment Type': 'Therapy Session';
	'Bill as Supervisor': 'yes';
	'Billing Method': 'In-Network Insurance, EDI';
	'Clinician NPI': '1962817627';
	'Clinician Name': 'Laura Crawford';
	'Clinician Type': 'Counselor';
	DOB: '10/12/13';
	Date: 43794.395833333336;
	'First Name': 'Jaxsyn';
	'In Network': 'yes';
	'Insurance Amount Due': 79;
	'Insurance Amount Paid': -31;
	'Insurance Balance Status': 'Paid';
	'Last Name': 'Beedy';
	Location: '382 Arch St';
	'Note Status': 'Finalized';
	'Patient Amount Due': 41;
	'Patient Amount Paid': -41;
	'Patient Balance Status': 'Paid in Full';
	'Patient Member ID': '01216509400';
	'Primary Diagnosis': 'F41.1';
	'Primary Insurer Group': 'Tricare East';
	'Primary Insurer Name': 'Tricare East';
	Rate: 120;
	'Service Code': '90837';
	'Service Description': 'Psychotherapy, 60 min';
	'Supervisor NPI': '1962817627';
	'Supervisor Name': 'Alvin Mares';
	Type: 'Appointment' | 'Contact';
	Units: 1;
}