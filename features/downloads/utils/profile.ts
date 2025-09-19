/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { SubtitleDeliveryMethod, type SubtitleProfile } from '@jellyfin/sdk/lib/generated-client/models';
import type { DeviceProfile } from '@jellyfin/sdk/lib/generated-client/models/device-profile';
import { MediaStreamProtocol } from '@jellyfin/sdk/lib/generated-client/models/media-stream-protocol';

const SubtitleProfiles: SubtitleProfile[] = [
	{ Method: SubtitleDeliveryMethod.Encode }
];

/** Converts a playback DeviceProfile to one used for downloads. */
export const toDownloadProfile = (playbackProfile: DeviceProfile): DeviceProfile => {
	const downloadProfile = {
		...playbackProfile,
		Name: playbackProfile.Name?.replace(' Native Profile', ' Download Profile'),
		TranscodingProfiles: (playbackProfile.TranscodingProfiles || [])
			.filter(p => p.Protocol !== MediaStreamProtocol.Hls),
		SubtitleProfiles
	};
	return downloadProfile;
};
