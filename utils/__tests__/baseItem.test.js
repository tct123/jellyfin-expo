/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { getItemSubtitle } from '../baseItem';

describe('getItemSubtitle', () => {
	it('should handle episodes correctly', () => {
		const item = {
			SeriesName: 'Series Name'
		};
		expect(getItemSubtitle(item)).toBe('Series Name');

		item.ParentIndexNumber = 5;
		expect(getItemSubtitle(item)).toBe('Series Name S5');

		item.IndexNumber = 11;
		expect(getItemSubtitle(item)).toBe('Series Name S5E11');

		item.IndexNumberEnd = 13;
		expect(getItemSubtitle(item)).toBe('Series Name S5E11-13');

		delete item.ParentIndexNumber;
		delete item.IndexNumberEnd;
		expect(getItemSubtitle(item)).toBe('Series Name E11');
	});

	it('should handle songs correctly', () => {
		const item = {
			Album: 'Album Name'
		};
		expect(getItemSubtitle(item)).toBe('Album Name');

		item.AlbumArtist = 'Artist Name';
		expect(getItemSubtitle(item)).toBe('Artist Name · Album Name');
	});

	it('should fallback to production year for other types', () => {
		const item = { ProductionYear: 2025 };
		expect(getItemSubtitle(item)).toBe('2025');
	});
});
