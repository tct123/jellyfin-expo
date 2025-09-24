/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { CodecType } from '@jellyfin/sdk/lib/generated-client/models/codec-type';
import type { DeviceProfile } from '@jellyfin/sdk/lib/generated-client/models/device-profile';
import { ProfileConditionType } from '@jellyfin/sdk/lib/generated-client/models/profile-condition-type';
import { ProfileConditionValue } from '@jellyfin/sdk/lib/generated-client/models/profile-condition-value';
import { SubtitleDeliveryMethod } from '@jellyfin/sdk/lib/generated-client/models/subtitle-delivery-method';

const BaseProfile = {
	Name: 'Base Native Profile',
	MaxStaticBitrate: 100000000, // 100 Mbps
	MaxStreamingBitrate: 120000000, // 120 Mbps
	MusicStreamingTranscodingBitrate: 384000, // 384 kbps
	CodecProfiles: [
		{
			Codec: 'h264',
			Conditions: [
				{
					Condition: ProfileConditionType.NotEquals,
					IsRequired: false,
					Property: ProfileConditionValue.IsAnamorphic,
					Value: 'true'
				},
				{
					Condition: ProfileConditionType.EqualsAny,
					IsRequired: false,
					Property: ProfileConditionValue.VideoProfile,
					Value: 'high|main|baseline|constrained baseline'
				},
				{
					Condition: ProfileConditionType.EqualsAny,
					IsRequired: false,
					Property: ProfileConditionValue.VideoRangeType,
					Value: 'SDR'
				},
				{
					Condition: ProfileConditionType.LessThanEqual,
					IsRequired: false,
					Property: ProfileConditionValue.VideoLevel,
					Value: '52'
				},
				{
					Condition: ProfileConditionType.NotEquals,
					IsRequired: false,
					Property: ProfileConditionValue.IsInterlaced,
					Value: 'true'
				}
			],
			Type: CodecType.Video
		},
		{
			Codec: 'hevc',
			Conditions: [
				{
					Condition: ProfileConditionType.NotEquals,
					IsRequired: false,
					Property: ProfileConditionValue.IsAnamorphic,
					Value: 'true'
				},
				{
					Condition: ProfileConditionType.EqualsAny,
					IsRequired: false,
					Property: ProfileConditionValue.VideoProfile,
					Value: 'main|main 10'
				},
				{
					Condition: ProfileConditionType.EqualsAny,
					IsRequired: false,
					Property: ProfileConditionValue.VideoRangeType,
					Value: 'SDR|HDR10'
				},
				{
					Condition: ProfileConditionType.LessThanEqual,
					IsRequired: false,
					Property: ProfileConditionValue.VideoLevel,
					Value: '153'
				},
				{
					Condition: ProfileConditionType.NotEquals,
					IsRequired: false,
					Property: ProfileConditionValue.IsInterlaced,
					Value: 'true'
				},
				{
					Condition: ProfileConditionType.EqualsAny,
					IsRequired: true,
					Property: ProfileConditionValue.VideoCodecTag,
					Value: 'hvc1'
				},
				{
					Condition: ProfileConditionType.LessThanEqual,
					IsRequired: true,
					Property: ProfileConditionValue.VideoFramerate,
					Value: '60'
				}
			],
			Type: CodecType.Video
		}
	],
	ContainerProfiles: [],
	DirectPlayProfiles: [],
	SubtitleProfiles: [
		{
			Format: 'vtt',
			Method: SubtitleDeliveryMethod.Hls
		}
	],
	TranscodingProfiles: []
} satisfies DeviceProfile;

export default BaseProfile;
