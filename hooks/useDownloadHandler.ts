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

export const useDownloadHandler = (enabled = false) => {
	const { rootStore, downloadStore } = useStores();
	const { t } = useTranslation();

	useEffect(() => {
		if (!enabled) return;

		const downloadFile = async (download: DownloadModel) => {
			console.debug('[useDownloadHandler] downloading "%s"', download.item.Name || download.item.Path);

			try {
				// For transcoded downloads we force .mp4
				if (!download.extension) {
					download.extension = '.mp4';
				}
				// Update the status
				download.status = DownloadStatus.Downloading;
				downloadStore.update(download);

				// Create the download folder if it doesn't exist
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

				// Download the file
				await resumable.downloadAsync();
				download.status = DownloadStatus.Complete;

				// Report download has stopped
				const serverUrl = download.serverUrl.endsWith('/') ? download.serverUrl.slice(0, -1) : download.serverUrl;
				const api = rootStore.getSdk().createApi(serverUrl, download.apiKey);
				console.debug('[useDownloadHandler] Reporting download stopped', download.sessionId);
				await getPlaystateApi(api)
					.reportPlaybackStopped({
						playbackStopInfo: {
							PlaySessionId: download.sessionId
						}
					})
					.catch(err => {
						console.warn('[useDownloadHandler] Failed reporting download stopped', err.response || err.request || err.message);
					});
			} catch (e) {
				console.error('[useDownloadHandler] Download failed', e);
				Alert.alert(
					t('alerts.downloadFailed.title'),
					t('alerts.downloadFailed.description', { title: download.title })
				);

				download.status = DownloadStatus.Failed;
			} finally {
				// Push the state update to the store
				downloadStore.update(download);
			}
		};

		downloadStore.downloads
			.forEach(download => {
				if (download.status === DownloadStatus.Pending) {
					downloadFile(download);
				}
			});
	}, [ enabled, rootStore.deviceId, downloadStore.downloads ]);
};
