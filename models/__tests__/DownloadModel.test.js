/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DownloadStatus } from '../../constants/DownloadStatus';
import DownloadModel, { fromStorageObject } from '../DownloadModel';

const DOCUMENT_DIRECTORY = '/DOC_DIR/';

jest.mock('expo-file-system', () => ({
	documentDirectory: DOCUMENT_DIRECTORY
}));

describe('DownloadModel', () => {
	it('should create a DownloadModel with computed properties', () => {
		const download = new DownloadModel(
			{
				Id: 'item-id',
				ServerId: 'server-id',
				Name: 'title',
				Path: 'title.mkv',
				ProductionYear: 2025
			},
			'https://example.com/',
			'api-key',
			'file name.mkv',
			'https://example.com/download'
		);
		download.extension = '.mp4';

		expect(download.apiKey).toBe('api-key');
		expect(download.itemId).toBe('item-id');
		expect(download.sessionId).toBe('uuid-0');
		expect(download.serverId).toBe('server-id');
		expect(download.serverUrl).toBe('https://example.com/');

		expect(download.title).toBe('title');
		expect(download.filename).toBe('file name.mkv');

		expect(download.downloadUrl).toBe('https://example.com/download');

		expect(download.isComplete).toBe(false);
		expect(download.status).toBe(DownloadStatus.Pending);
		expect(download.isNew).toBe(true);

		expect(download.key).toBe('server-id_item-id');
		expect(download.isSharedPath).toBe(false);
		expect(download.localFilename).toBe('title (2025).mp4');
		expect(download.localPath).toBe(`${DOCUMENT_DIRECTORY}Downloads/title (2025)/`);
		expect(download.uri).toBe(`${DOCUMENT_DIRECTORY}Downloads/title%20(2025)/title%20(2025).mp4`);
		expect(download.getStreamUrl('device-id').toString()).toBe('https://example.com/Videos/item-id/stream.mp4?deviceId=device-id&api_key=api-key&playSessionId=uuid-0&videoCodec=hevc%2Ch264&audioCodec=aac%2Cmp3%2Cac3%2Ceac3%2Cflac%2Calac&maxAudioChannels=6');
	});

	it('should return true if the download\'s localPath could be shared by other downloads', () => {
		let download = new DownloadModel(
			{
				Id: 'item-id',
				ServerId: 'server-id',
				Album: 'Album Name'
			},
			'https://example.com/',
			'api-key',
			'file name.mkv',
			'https://example.com/download'
		);
		expect(download.isSharedPath).toBe(true);

		download = new DownloadModel(
			{
				Id: 'item-id',
				ServerId: 'server-id',
				SeriesName: 'Series Name'
			},
			'https://example.com/',
			'api-key',
			'file name.mkv',
			'https://example.com/download'
		);
		expect(download.isSharedPath).toBe(true);
	});

	it('should return fallback values for legacy downloads', () => {
		const download = new DownloadModel(
			{
				Id: 'item-id',
				ServerId: 'server-id'
			},
			'https://example.com/',
			'api-key',
			'file name.mkv',
			'https://example.com/download'
		);

		expect(download.title).toBeUndefined();
		expect(download.localPath).toBe(`${DOCUMENT_DIRECTORY}server-id/item-id/`);
	});

	it('should create a DownloadModel from a storage object', () => {
		const value = {
			itemId: 'item-id',
			serverId: 'server-id',
			serverUrl: 'https://example.com/',
			apiKey: 'api-key',
			title: 'title',
			filename: 'file name.mkv',
			downloadUrl: 'https://example.com/download',
			isComplete: true,
			isNew: false
		};
		const download = fromStorageObject(value);

		expect(download).toBeInstanceOf(DownloadModel);
		expect(download.apiKey).toBe(value.apiKey);
		expect(download.itemId).toBe(value.itemId);
		expect(download.serverId).toBe(value.serverId);
		expect(download.serverUrl).toBe(value.serverUrl);
		expect(download.title).toBe(value.title);
		expect(download.filename).toBe(value.filename);
		expect(download.downloadUrl).toBe(value.downloadUrl);
		expect(download.status).toBe(DownloadStatus.Complete);
		expect(download.isComplete).toBe(value.isComplete);
		expect(download.isNew).toBe(value.isNew);
	});
});
