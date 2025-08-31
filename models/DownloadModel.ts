/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

interface BaseItem extends BaseItemDto {
	Id: string;
	ServerId: string;
}

export default class DownloadModel {
	isComplete = false
	isDownloading = false
	isNew = true

	apiKey: string
	itemId: string
	item: BaseItem
	/** The "play" session ID for reporting a download has stopped. */
	sessionId = uuidv4()
	serverId: string
	serverUrl: string

	title?: string
	filename: string

	downloadUrl: string

	constructor(
		item: BaseItem,
		serverUrl: string,
		apiKey: string,
		filename: string,
		downloadUrl: string
	) {
		this.item = item;
		this.itemId = item.Id;
		this.serverId = item.ServerId;
		this.serverUrl = serverUrl;
		this.apiKey = apiKey;
		this.title = item.Name || undefined;
		this.filename = filename;
		this.downloadUrl = downloadUrl;
	}

	get key() {
		return `${this.serverId}_${this.itemId}`;
	}

	get localFilename() {
		return this.filename.slice(0, this.filename.lastIndexOf('.')) + '.mp4';
	}

	get localPath() {
		return `${FileSystem.documentDirectory}${this.serverId}/${this.itemId}/`;
	}

	get uri() {
		return this.localPath + encodeURI(this.localFilename);
	}

	getStreamUrl(deviceId: string, params?: Record<string, string>): URL {
		const streamParams = new URLSearchParams({
			deviceId,
			api_key: this.apiKey,
			playSessionId: this.sessionId,
			// TODO: add mediaSourceId to support alternate media versions
			videoCodec: 'hevc,h264',
			audioCodec: 'aac,mp3,ac3,eac3,flac,alac',
			maxAudioChannels: '6',
			// subtitleCodec: 'srt,vtt',
			// subtitleMethod: 'Encode',
			...params
		});
		return new URL(`${this.serverUrl}Videos/${this.itemId}/stream.mp4?${streamParams.toString()}`);
	}
}

export function fromStorageObject(value: {
	itemId: string,
	serverId: string,
	serverUrl: string,
	apiKey: string,
	title: string,
	filename: string,
	downloadUrl: string,
	isComplete: boolean,
	isNew: boolean
}): DownloadModel {
	const model = new DownloadModel(
		{
			Id: value.itemId,
			ServerId: value.serverId,
			Name: value.title
		},
		value.serverUrl,
		value.apiKey,
		value.filename,
		value.downloadUrl
	);
	model.isComplete = value.isComplete;
	model.isNew = value.isNew;
	return model;
}
