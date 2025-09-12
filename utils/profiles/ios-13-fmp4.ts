/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { DeviceProfile } from '@jellyfin/sdk/lib/generated-client/models/device-profile';
import { DlnaProfileType } from '@jellyfin/sdk/lib/generated-client/models/dlna-profile-type';
import { EncodingContext } from '@jellyfin/sdk/lib/generated-client/models/encoding-context';
import { MediaStreamProtocol } from '@jellyfin/sdk/lib/generated-client/models/media-stream-protocol';

import iOSProfile from './ios-13';

/**
 * Device profile for Expo Video player on iOS 13+ with fMP4 support
 */
const IosFmp4Profile = {
	...iOSProfile,
	Name: iOSProfile.Name + ' + fMP4',
	TranscodingProfiles: [
		// Add all audio profiles from default profile
		...iOSProfile.TranscodingProfiles.filter(profile => profile.Type === DlnaProfileType.Audio),
		// Add fMP4 profile
		{
			AudioCodec: 'aac,mp3,flac,alac',
			BreakOnNonKeyFrames: true,
			Container: 'mp4',
			Context: EncodingContext.Streaming,
			MaxAudioChannels: '6',
			MinSegments: 2,
			Protocol: MediaStreamProtocol.Hls,
			Type: DlnaProfileType.Video,
			VideoCodec: 'hevc,h264'
		},
		// Add all video profiles from default profile
		...iOSProfile.TranscodingProfiles.filter(profile => profile.Type === DlnaProfileType.Video)
	]
} satisfies DeviceProfile;

export default IosFmp4Profile;
