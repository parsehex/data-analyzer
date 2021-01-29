import { format } from 'date-fns';
import { newDateFromExcel } from '@/lib/utils';
import { IntakeQRow_AuditTrail } from '@/types/file-data/intakeq';
import { parse } from 'date-fns';

export interface MissingIntakes_Result {
	name: string;
	created?: Date;
	intake: {
		sent?: {
			date: Date;
			form: string;
		};
		submitted?: {
			date: Date;
			form: string;
		};
	};
}
export function missingIntakesResults(data: IntakeQRow_AuditTrail[]) {
	const clients: MissingIntakes_Result[] = [];

	for (const row of data) {
		if (!row.Client) continue;

		const { Action, Client, Date: rawDate, Object: object } = row;
		// @ts-ignore
		const date = parse(rawDate, 'M/d/yyyy H:m', new Date());

		if (typeof date !== 'object') console.log(rawDate);
		// if (typeof date !== 'string') console.log({ Id, date });

		if (!object.includes('MCC') || !object.includes('Intake')) continue;

		const actionType = classifyAction(Action);

		if (!actionType) continue;

		if (!actionType.includes('CLIENT') && !actionType.includes('FORM'))
			continue;

		let client = clients.find((v) => v.name === Client);

		if (!client) {
			client = {
				name: Client,
				intake: {},
			};
			clients.push(client);
		}

		if (['CLIENT_CREATED', 'CLIENT_CREATED_FORM_SENT'].includes(actionType)) {
			client.created = date;
		}

		if (['CLIENT_CREATED_FORM_SENT', 'FORM_SENT'].includes(actionType)) {
			client.intake.sent = {
				date,
				form: extractObjectName(row, actionType),
			};
		}

		if ('FORM_SUBMITTED' === actionType) {
			client.intake.submitted = {
				date,
				form: extractObjectName(row, actionType),
			};
		}
	}

	return clients;
}

type ActionType =
	| 'AUTH_EMAIL_SENT'
	| 'CLIENT_CREATED'
	| 'CLIENT_CREATED_FORM_SENT'
	| 'CLIENT_PROFILE_OPENED'
	| 'CLIENT_PROFILE_UPDATED'
	| 'FORM_DELETED'
	| 'FORM_PRINTED'
	| 'FORM_REJECTED'
	| 'FORM_SENT'
	| 'FORM_SIGNED_INTO'
	| 'FORM_SUBMITTED'
	| 'FORM_VIEWED'
	| 'NOTE_CREATED'
	| 'NOTE_LOCKED'
	| 'NOTE_PRINTED'
	| 'NOTE_UPDATED'
	| 'NOTE_VIEWED';
function classifyAction(Action: string): ActionType {
	if (/^IntakeQ sent .+ email auth.+\.$/i.test(Action))
		return 'AUTH_EMAIL_SENT';
	if (/^.+ created client .+\.$/i.test(Action)) return 'CLIENT_CREATED';
	if (/^Client .+ created when sending the form.+\.$/i.test(Action))
		return 'CLIENT_CREATED_FORM_SENT';
	if (/^.+ opened client profile of .+\.$/i.test(Action))
		return 'CLIENT_PROFILE_OPENED';
	if (/^.+ updated client profile of .+\.$/i.test(Action))
		return 'CLIENT_PROFILE_UPDATED';
	if (/^.+ deleted the form .+ of client .+\.$/i.test(Action))
		return 'FORM_DELETED';
	if (/^.+ printed the form .+ of client .+\.$/i.test(Action))
		return 'FORM_PRINTED';
	if (/^.+ rejected the form .+ of client .+\.$/i.test(Action))
		return 'FORM_REJECTED';
	if (/^.+ (?:re-)?sent the form .+ to client .+\.$/i.test(Action))
		return 'FORM_SENT';
	if (/^.+ signed into form .+\.$/i.test(Action)) return 'FORM_SIGNED_INTO';
	if (/^.+ submitted form .+\.$/i.test(Action)) return 'FORM_SUBMITTED';
	if (/^.+ viewed the form .+ of client .+\.$/i.test(Action))
		return 'FORM_VIEWED';
	if (/^.+ created a note .+ for client .+\.$/i.test(Action))
		return 'NOTE_CREATED';
	if (/^.+ locked the note .+ of client .+\.$/i.test(Action))
		return 'NOTE_LOCKED';
	if (/^.+ printed the note .+ of client .+\.$/i.test(Action))
		return 'NOTE_PRINTED';
	if (/^.+ updated the note .+ of client .+\.$/i.test(Action))
		return 'NOTE_UPDATED';
	if (/^.+ viewed the note .+ of client .+\.$/i.test(Action))
		return 'NOTE_VIEWED';

	console.error(`Couldn't classify action ${Action}`);
}

function extractObjectName(row: IntakeQRow_AuditTrail, actionType: ActionType) {
	if (actionType !== 'CLIENT_CREATED_FORM_SENT') return row.Object;

	try {
		return row.Action.match(/^Client .+ created .+ the form (.+)\.$/i)[1];
	} catch (e) {
		console.error(`Couldn't extract Object name from row ${row}`);
		return null;
	}
}
