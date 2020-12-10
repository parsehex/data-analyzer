import Dexie from 'dexie';

export default function applyVersions(db: Dexie) {
	db.version(1).stores({
		files: `++id, file_id, name, type, last_opened, first_opened`,
		files_data: '++id, file_id, version, type',
	});
	db.version(2)
		.stores({
			files: `++id, file_id, name, type, last_opened, first_opened, version`,
			// in the future version 3, remove files_data
		})
		.upgrade((tx) => {
			return tx.table('files').each(async (file) => {
				const data = await tx
					.table('files_data')
					.get({ file_id: file.file_id });

				const newData = Object.assign({}, file, {
					content: data.file_data,
					version: data.version,
				});

				await tx
					.table('files')
					.where('file_id')
					.equals(file.file_id)
					.modify(newData);
			});
		});
}
