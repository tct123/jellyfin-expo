/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';

export const getItemSubtitle = (item: BaseItemDto) => {
	// Episodes will show: Series Name S1E5-6
	if (item.SeriesName) {
		let episode = '';
		if (item.ParentIndexNumber) episode += `S${item.ParentIndexNumber}`;
		if (item.IndexNumber) episode += `E${item.IndexNumber}`;
		if (item.IndexNumberEnd) episode += `-${item.IndexNumberEnd}`;
		return episode ? `${item.SeriesName} ${episode}` : item.SeriesName;
	}

	// Songs will show: Artist Name · Album Name
	if (item.Album) {
		return [
			item.AlbumArtist,
			item.Album
		]
			.filter(t => !!t)
			.join(' · ');
	}

	// Everything else will show the production year or fallback to the filename for legacy downloads
	return item.ProductionYear?.toString();
};
