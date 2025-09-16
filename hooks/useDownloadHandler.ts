/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { DeviceProfile } from '@jellyfin/sdk/lib/generated-client/models/device-profile';
import { MediaStreamProtocol } from '@jellyfin/sdk/lib/generated-client/models/media-stream-protocol';
import { MediaType } from '@jellyfin/sdk/lib/generated-client/models/media-type';
import { getMediaInfoApi } from '@jellyfin/sdk/lib/utils/api/media-info-api';
import { getPlaystateApi } from '@jellyfin/sdk/lib/utils/api/playstate-api';
import * as FileSystem from 'expo-file-system';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { DownloadStatus } from '../constants/DownloadStatus';
import type DownloadModel from '../models/DownloadModel';
import { getDeviceProfile } from '../utils/Device';
import { ensurePathExists } from '../utils/File';

import { useStores } from './useStores';

const STREAMING_MEDIA_TYPES: MediaType[] = [ MediaType.Audio, MediaType.Video ];

export const useDownloadHandler = (enabled = false) => {
	const { downloadStore, rootStore, settingStore } = useStores();
	const { t } = useTranslation();

	const downloadFile = useCallback(async (download: DownloadModel) => {
		console.debug('[useDownloadHandler] downloading "%s"', download.item.Name || download.item.Path);

		try {
			// Update the status
			download.status = DownloadStatus.Downloading;
			downloadStore.update(download);

			// Create the download folder if it doesn't exist
			await ensurePathExists(download.localPath);

			// Get an API instance
			const serverUrl = download.serverUrl.endsWith('/') ? download.serverUrl.slice(0, -1) : download.serverUrl;
			const api = rootStore.getSdk().createApi(serverUrl, download.apiKey);

			let url = new URL(download.downloadUrl);
			let isTranscoding = false;

			if (
				// Check that transcoded downloads are enabled
				settingStore.isExperimentalDownloadsEnabled &&
				// Only Audio or Video types can be transcoded
				download.item.MediaType &&
				STREAMING_MEDIA_TYPES.includes(download.item.MediaType)
			) {
				// Filter any HLS transcoding profiles out for downloads
				const playbackProfile = getDeviceProfile();
				const downloadProfile: DeviceProfile = {
					...playbackProfile,
					Name: playbackProfile.Name?.replace(' Native Profile', ' Download Profile'),
					TranscodingProfiles: (playbackProfile.TranscodingProfiles || [])
						.filter(p => p.Protocol !== MediaStreamProtocol.Hls)
				};

				const { data: playbackInfo } = await getMediaInfoApi(api)
					.getPostedPlaybackInfo({
						itemId: download.item.Id,
						playbackInfoDto: {
							DeviceProfile: downloadProfile
						}
					});

				// Check that playback info returned at least one source
				if (!playbackInfo.MediaSources || playbackInfo.MediaSources.length < 1) {
					throw new Error('No media sources found');
				}

				// Update the download session id if provided
				if (playbackInfo.PlaySessionId) download.sessionId = playbackInfo.PlaySessionId;

				// The server sorts media sources, so the first _should_ be the best.
				const firstMediaSource = playbackInfo.MediaSources[0];

				if (firstMediaSource.SupportsDirectPlay || firstMediaSource.SupportsDirectStream) {
					// For direct play we must build the URL ourselves
					console.debug('[useDownloadHandler] media source will direct play/stream', firstMediaSource);
					const endpoint = download.item.MediaType === MediaType.Video ? 'Videos' : 'Audio';
					download.extension = `.${firstMediaSource.Container || ''}`;

					const streamParams = new URLSearchParams({
						deviceId: rootStore.deviceId,
						ApiKey: download.apiKey,
						playSessionId: download.sessionId,
						mediaSourceId: firstMediaSource.Id || '',
						Tag: firstMediaSource.ETag || '',
						Static: 'true'
					});

					url = new URL(`${serverUrl}/${endpoint}/${download.item.Id}/stream${download.extension}?${streamParams.toString()}`);
				} else if (firstMediaSource.SupportsTranscoding && firstMediaSource.TranscodingUrl) {
					// For transcoding the server returns the URL
					console.debug('[useDownloadHandler] media source will transcode', firstMediaSource);
					isTranscoding = true;
					url = new URL(`${serverUrl}${firstMediaSource.TranscodingUrl}`);

					download.extension = `.${firstMediaSource.TranscodingContainer || ''}`;
				} else {
					// If we can't direct play or transcode, then we can't play it (maybe we should just fallback to the download url)
					console.warn('[useDownloadHandler] server returned incompatible media source', firstMediaSource);
					throw new Error('No compatible media source found');
				}
			}

			console.debug('[useDownloadHandler] downloading from url', url);

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

			// Report transcoding download has stopped so the server will cleanup temp files
			if (isTranscoding) {
				console.debug('[useDownloadHandler] Reporting transcoding download stopped', download.sessionId);
				await getPlaystateApi(api)
					.reportPlaybackStopped({
						playbackStopInfo: {
							ItemId: download.item.Id,
							PlaySessionId: download.sessionId
						}
					})
					.catch(err => {
						console.warn('[useDownloadHandler] Failed reporting download stopped', err.response || err.request || err.message);
					});
			}
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
	}, [ rootStore.deviceId ]);

	useEffect(() => {
		if (!enabled) return;

		downloadStore.downloads
			.forEach(download => {
				if (download.status === DownloadStatus.Pending) {
					downloadFile(download);
				}
			});
	}, [ enabled, downloadStore.downloads ]);
};
