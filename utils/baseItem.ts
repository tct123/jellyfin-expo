/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';
import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';

import { sanitizeFileName } from './File';

const NO_ARTIST_TYPES: BaseItemKind[] = [
	BaseItemKind.Photo,
	BaseItemKind.Video
];

/** Gets the short episode ID for display. e.g. S2E5-6 */
const getShortEpisodeId = (item: BaseItemDto): string | undefined => {
	let episode = '';
	if (typeof item.ParentIndexNumber !== 'undefined') {
		episode += `S${item.ParentIndexNumber}`;
	}
	if (typeof item.IndexNumber !== 'undefined') {
		episode += `E${item.IndexNumber}`;
		if (typeof item.IndexNumberEnd !== 'undefined') {
			episode += `-${item.IndexNumberEnd}`;
		}
	}
	return episode || undefined;
};

/** Gets the name and year of an item for display. e.g. Name (2025) */
const getNameAndYear = (item: BaseItemDto): string | undefined => {
	const name = item.SeriesName ? item.SeriesName : item.Name;
	if (name) {
		if (item.ProductionYear) return `${name} (${item.ProductionYear})`;
		return name;
	}
};

/**
 * Gets the subtitle that should be displayed under an item's name.
 */
export const getItemSubtitle = (item: BaseItemDto): string | undefined => {
	// Episodes will show: Series Name S1E5-6
	if (item.SeriesName) {
		const episode = getShortEpisodeId(item);
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

	// Everything else will show the production year if available
	return item.ProductionYear?.toString();
};

/**
 * Gets the directory path that an item should be saved under.
 */
export const getItemDirectory = (item: BaseItemDto): string | undefined => {
	if (item.Album) {
		// Photos or Home Videos will use: Album Name/
		const album = sanitizeFileName(item.Album) || 'Unknown Album';
		if (item.Type && NO_ARTIST_TYPES.includes(item.Type)) return `${album}/`;

		// Songs or Music Videos will use: Artist Name/Album Name/
		// NOTE: It would be better to separate by Disc but we have no way of identifying songs from multi-disc albums
		// from the BaseItem of the song.
		const artist = sanitizeFileName(item.AlbumArtist || undefined) || 'Unknown Artist';
		return `${artist}/${album}/`;
	}

	const nameAndYear = sanitizeFileName(getNameAndYear(item));

	if (nameAndYear) {
		// Episodes will use: Series Name (2025)/Season 1/
		if (item.SeriesName && typeof item.ParentIndexNumber !== 'undefined') {
			return `${nameAndYear}/Season ${item.ParentIndexNumber}/`;
		}

		// Everything else should use: Item Name (2025)/
		return `${nameAndYear}/`;
	}
};

export const getItemFileName = (item: BaseItemDto): string | undefined => {
	// Songs will use: 5 - Song Name
	// NOTE: It would be better to include the Disc number but we have no way of identifying songs from multi-disc
	// albums from the BaseItem of the song.
	if (item.Album) {
		const name = [
			item.IndexNumber,
			item.Name
		]
			.filter(t => typeof t !== 'undefined' && t !== '')
			.join(' - ');
		return sanitizeFileName(name);
	}

	// Episodes will use: Series Name - S1E5-6 - Episode Name
	if (item.SeriesName) {
		const name = [
			item.SeriesName,
			getShortEpisodeId(item),
			item.Name
		]
			.filter(t => !!t)
			.join(' - ');
		return sanitizeFileName(name);
	}

	// Everything else should use: Item Name (2025)
	return sanitizeFileName(getNameAndYear(item));
};
