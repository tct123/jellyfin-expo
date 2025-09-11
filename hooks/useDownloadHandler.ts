/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { getPlaystateApi } from '@jellyfin/sdk/lib/utils/api/playstate-api';
import * as FileSystem from 'expo-file-system';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { DownloadStatus } from '../constants/DownloadStatus';
import type DownloadModel from '../models/DownloadModel';
import { ensurePathExists } from '../utils/File';

import { useStores } from './useStores';

export const useDownloadHandler = () => {
	const { rootStore, downloadStore } = useStores();
	const { t } = useTranslation();

	useEffect(() => {
		const downloadFile = async (download: DownloadModel) => {
			console.debug('[App] downloading "%s"', download.filename);
			// For transcoded downloads we force .mp4
			if (!download.extension) {
				download.extension = '.mp4';
				downloadStore.update(download);
			}
			await ensurePathExists(download.localPath);

			const url = download.getStreamUrl(rootStore.deviceId);

			const resumable = FileSystem.createDownloadResumable(
				url.toString(),
				download.uri,
				{},
				(/*{ totalBytesWritten }*/) => {
					// FIXME: We should save the download progress in the model for display
					// but this needs throttling
				}
			);

			// TODO: The resumable should be saved to allow pausing/resuming downloads

			// Download the file
			try {
				download.status = DownloadStatus.Downloading;
				downloadStore.update(download);
				await resumable.downloadAsync();
				download.status = DownloadStatus.Complete;
			} catch (e) {
				console.error('[App] Download failed', e);
				Alert.alert(
					t('alerts.downloadFailed.title'),
					t('alerts.downloadFailed.description', { title: download.title })
				);

				// TODO: If a download fails, we should probably remove it from the queue
				download.status = DownloadStatus.Failed;
			}

			// Push the state update to the store
			downloadStore.update(download);

			// Report download has stopped
			const serverUrl = download.serverUrl.endsWith('/') ? download.serverUrl.slice(0, -1) : download.serverUrl;
			const api = rootStore.getSdk().createApi(serverUrl, download.apiKey);
			console.log('[App] Reporting download stopped', download.sessionId);
			getPlaystateApi(api)
				.reportPlaybackStopped({
					playbackStopInfo: {
						PlaySessionId: download.sessionId
					}
				})
				.catch(err => {
					console.error('[App] Failed reporting download stopped', err.response || err.request || err.message);
				});
		};

		downloadStore.downloads
			.forEach(download => {
				if (download.status === DownloadStatus.Pending) {
					downloadFile(download);
				}
			});
	}, [ rootStore.deviceId, downloadStore.downloads.size ]);
};
