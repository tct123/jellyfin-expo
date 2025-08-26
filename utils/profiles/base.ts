/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { DeviceProfile } from '@jellyfin/sdk/lib/generated-client/models/device-profile';
import { DlnaProfileType } from '@jellyfin/sdk/lib/generated-client/models/dlna-profile-type';
import { ProfileConditionType } from '@jellyfin/sdk/lib/generated-client/models/profile-condition-type';
import { ProfileConditionValue } from '@jellyfin/sdk/lib/generated-client/models/profile-condition-value';
import { SubtitleDeliveryMethod } from '@jellyfin/sdk/lib/generated-client/models/subtitle-delivery-method';

const BaseProfile: DeviceProfile = {
	Name: 'Expo Base Video Profile',
	MaxStaticBitrate: 100_000_000, // 100 Mbps
	MaxStreamingBitrate: 120_000_000, // 120 Mbps
	MusicStreamingTranscodingBitrate: 384_000, // 384 kbps
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
					Condition: ProfileConditionType.LessThanEqual,
					IsRequired: false,
					Property: ProfileConditionValue.VideoLevel,
					Value: '51'
				},
				{
					Condition: ProfileConditionType.NotEquals,
					IsRequired: false,
					Property: ProfileConditionValue.IsInterlaced,
					Value: 'true'
				}
			],
			Type: DlnaProfileType.Video
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
					Condition: ProfileConditionType.LessThanEqual,
					IsRequired: false,
					Property: ProfileConditionValue.VideoLevel,
					Value: '183'
				},
				{
					Condition: ProfileConditionType.NotEquals,
					IsRequired: false,
					Property: ProfileConditionValue.IsInterlaced,
					Value: 'true'
				}
			],
			Type: DlnaProfileType.Video
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
};

export default BaseProfile;
