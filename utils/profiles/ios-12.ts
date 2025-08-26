/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { DeviceProfile } from '@jellyfin/sdk/lib/generated-client/models/device-profile';

import iOSProfile from './ios';

/**
 * Device profile for Expo Video player on iOS 11-12
 */
const Ios12Profile: DeviceProfile = {
	...iOSProfile,
	Name: 'Expo iOS 12 Video Profile',
	CodecProfiles: [
		// iOS<13 only supports max h264 level 4.2 in ts containers
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
					Condition: 'NotEquals',
					IsRequired: false,
					Property: 'IsInterlaced',
					Value: 'true'
				},
				{
					Condition: 'LessThanEqual',
					IsRequired: false,
					Property: 'VideoLevel',
					Value: '42'
				}
			],
			Container: 'ts',
			Type: 'Video'
		},
		...(iOSProfile.CodecProfiles ?? [])
	]
};

export default Ios12Profile;
