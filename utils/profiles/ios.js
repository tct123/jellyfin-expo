/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { DlnaProfileType } from '@jellyfin/sdk/lib/generated-client/models/dlna-profile-type';

import BaseProfile from './base';

/**
 * Device profile for Expo Video player on iOS 13+
 */
export default {
	...BaseProfile,
	Name: 'Expo iOS Video Profile',
	DirectPlayProfiles: [
		{
			AudioCodec: 'aac,mp3,ac3,eac3,flac,alac',
			Container: 'mp4,m4v',
			Type: DlnaProfileType.Video,
			VideoCodec: 'hevc,h264'
		},
		{
			AudioCodec: 'aac,mp3,ac3,eac3,flac,alac',
			Container: 'mov',
			Type: DlnaProfileType.Video,
			VideoCodec: 'hevc,h264'
		},
		{
			Container: 'mp3',
			Type: DlnaProfileType.Audio
		},
		{
			Container: 'aac',
			Type: DlnaProfileType.Audio
		},
		{
			AudioCodec: 'aac',
			Container: 'm4a',
			Type: DlnaProfileType.Audio
		},
		{
			AudioCodec: 'aac',
			Container: 'm4b',
			Type: DlnaProfileType.Audio
		},
		{
			Container: 'flac',
			Type: DlnaProfileType.Audio
		},
		{
			Container: 'alac',
			Type: DlnaProfileType.Audio
		},
		{
			AudioCodec: 'alac',
			Container: 'm4a',
			Type: DlnaProfileType.Audio
		},
		{
			AudioCodec: 'alac',
			Container: 'm4b',
			Type: DlnaProfileType.Audio
		},
		{
			Container: 'wav',
			Type: DlnaProfileType.Audio
		}
	],
	TranscodingProfiles: [
		{
			AudioCodec: 'aac',
			BreakOnNonKeyFrames: true,
			Container: 'aac',
			Context: 'Streaming',
			MaxAudioChannels: '6',
			MinSegments: '2',
			Protocol: 'hls',
			Type: DlnaProfileType.Audio
		},
		{
			AudioCodec: 'aac',
			Container: 'aac',
			Context: 'Streaming',
			MaxAudioChannels: '6',
			Protocol: 'http',
			Type: DlnaProfileType.Audio
		},
		{
			AudioCodec: 'mp3',
			Container: 'mp3',
			Context: 'Streaming',
			MaxAudioChannels: '6',
			Protocol: 'http',
			Type: DlnaProfileType.Audio
		},
		{
			AudioCodec: 'wav',
			Container: 'wav',
			Context: 'Streaming',
			MaxAudioChannels: '6',
			Protocol: 'http',
			Type: DlnaProfileType.Audio
		},
		{
			AudioCodec: 'mp3',
			Container: 'mp3',
			Context: 'Static',
			MaxAudioChannels: '6',
			Protocol: 'http',
			Type: DlnaProfileType.Audio
		},
		{
			AudioCodec: 'aac',
			Container: 'aac',
			Context: 'Static',
			MaxAudioChannels: '6',
			Protocol: 'http',
			Type: DlnaProfileType.Audio
		},
		{
			AudioCodec: 'wav',
			Container: 'wav',
			Context: 'Static',
			MaxAudioChannels: '6',
			Protocol: 'http',
			Type: DlnaProfileType.Audio
		},
		{
			AudioCodec: 'aac,mp3',
			BreakOnNonKeyFrames: true,
			Container: 'ts',
			Context: 'Streaming',
			MaxAudioChannels: '6',
			MinSegments: '2',
			Protocol: 'hls',
			Type: DlnaProfileType.Video,
			VideoCodec: 'h264'
		},
		{
			AudioCodec: 'aac,mp3,ac3,eac3,flac,alac',
			Container: 'mp4',
			Context: 'Static',
			Protocol: 'http',
			Type: DlnaProfileType.Video,
			VideoCodec: 'h264'
		}
	]
};
