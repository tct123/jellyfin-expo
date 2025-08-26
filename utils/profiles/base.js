/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { DlnaProfileType } from '@jellyfin/sdk/lib/generated-client/models/dlna-profile-type';

export default {
	Name: 'Expo Base Video Profile',
	MaxStaticBitrate: 100000000,
	MaxStreamingBitrate: 120000000,
	MusicStreamingTranscodingBitrate: 384000,
	CodecProfiles: [
		{
			Codec: 'h264',
			Conditions: [
				{
					Condition: 'NotEquals',
					IsRequired: false,
					Property: 'IsAnamorphic',
					Value: 'true'
				},
				{
					Condition: 'EqualsAny',
					IsRequired: false,
					Property: 'VideoProfile',
					Value: 'high|main|baseline|constrained baseline'
				},
				{
					Condition: 'LessThanEqual',
					IsRequired: false,
					Property: 'VideoLevel',
					Value: '51'
				},
				{
					Condition: 'NotEquals',
					IsRequired: false,
					Property: 'IsInterlaced',
					Value: 'true'
				}
			],
			Type: DlnaProfileType.Video
		},
		{
			Codec: 'hevc',
			Conditions: [
				{
					Condition: 'NotEquals',
					IsRequired: false,
					Property: 'IsAnamorphic',
					Value: 'true'
				},
				{
					Condition: 'EqualsAny',
					IsRequired: false,
					Property: 'VideoProfile',
					Value: 'main|main 10'
				},
				{
					Condition: 'LessThanEqual',
					IsRequired: false,
					Property: 'VideoLevel',
					Value: '183'
				},
				{
					Condition: 'NotEquals',
					IsRequired: false,
					Property: 'IsInterlaced',
					Value: 'true'
				}
			],
			Type: DlnaProfileType.Video
		}
	],
	ContainerProfiles: [],
	DirectPlayProfiles: [],
	ResponseProfiles: [
		{
			Container: 'm4v',
			MimeType: 'video/mp4',
			Type: DlnaProfileType.Video
		}
	],
	SubtitleProfiles: [
		{
			Format: 'vtt',
			Method: 'Hls'
		}
	],
	TranscodingProfiles: []
};
