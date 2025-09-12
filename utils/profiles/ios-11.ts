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

import iOSProfile from './ios-13';

/**
 * Device profile for Expo Video player on iOS 11-12
 */
const Ios11Profile = {
	...iOSProfile,
	Name: 'iOS 11+ Native Profile',
	CodecProfiles: [
		// iOS<13 only supports max h264 level 4.2 in ts containers
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
					Condition: ProfileConditionType.NotEquals,
					IsRequired: false,
					Property: ProfileConditionValue.IsInterlaced,
					Value: 'true'
				},
				{
					Condition: ProfileConditionType.LessThanEqual,
					IsRequired: false,
					Property: ProfileConditionValue.VideoLevel,
					Value: '42'
				}
			],
			Container: 'ts',
			Type: CodecType.Video
		},
		...iOSProfile.CodecProfiles
	]
} satisfies DeviceProfile;

export default Ios11Profile;
