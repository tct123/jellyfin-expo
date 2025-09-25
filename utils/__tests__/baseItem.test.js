/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models';

import { getItemDirectory, getItemFileName, getItemSubtitle } from '../baseItem';

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

		item.ParentIndexNumber = 0;
		item.IndexNumber = 0;
		expect(getItemSubtitle(item)).toBe('Series Name S0E0');
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

	it('should return undefined when production year is unavailable', () => {
		expect(getItemSubtitle({})).toBeUndefined();
	});
});

describe('getItemDirectory', () => {
	it('should handle songs correctly', () => {
		const item = {
			Album: 'Album Name'
		};
		expect(getItemDirectory(item)).toBe('Unknown Artist/Album Name/');

		item.AlbumArtist = 'Ozzy Osbourne';
		expect(getItemDirectory(item)).toBe('Ozzy Osbourne/Album Name/');

		item.Album = '  ** ';
		item.AlbumArtist = ':?\\';
		expect(getItemDirectory(item)).toBe('Unknown Artist/Unknown Album/');
	});

	it('should handle photos correctly', () => {
		const item = {
			Album: 'Album Name',
			Type: BaseItemKind.Photo
		};
		expect(getItemDirectory(item)).toBe('Album Name/');

		item.AlbumArtist = 'Ozzy Osbourne';
		expect(getItemDirectory(item)).toBe('Album Name/');

		item.Album = '  ** ';
		item.AlbumArtist = ':?\\';
		expect(getItemDirectory(item)).toBe('Unknown Album/');
	});

	it('should handle episodes correctly', () => {
		const item = {
			SeriesName: 'Series Name',
			ParentIndexNumber: 3,
			ProductionYear: 2025
		};
		expect(getItemDirectory(item)).toBe('Series Name (2025)/Season 3/');

		item.SeriesName = '   ';
		delete item.ParentIndexNumber;
		delete item.ProductionYear;
		expect(getItemDirectory(item)).toBeUndefined();
	});

	it('should fallback to name and year when possible', () => {
		const item = {
			Name: 'Item Name'
		};
		expect(getItemDirectory(item)).toBe('Item Name/');

		item.ProductionYear = 2025;
		expect(getItemDirectory(item)).toBe('Item Name (2025)/');
	});

	it('should return undefined when no name or year is present', () => {
		expect(getItemDirectory({})).toBeUndefined();
	});
});

describe('getItemFileName', () => {
	it('should handle songs correctly', () => {
		const item = {
			Album: 'Album Name'
		};
		expect(getItemFileName(item)).toBeUndefined();

		item.Name = 'Song Name';
		expect(getItemFileName(item)).toBe('Song Name');

		item.IndexNumber = 2;
		expect(getItemFileName(item)).toBe('2 - Song Name');

		delete item.Name;
		expect(getItemFileName(item)).toBe('2');
	});

	it('should handle episodes correctly', () => {
		const item = {
			SeriesName: 'Series Name'
		};
		expect(getItemFileName(item)).toBe('Series Name');

		item.ParentIndexNumber = 3;
		item.IndexNumber = 15;
		expect(getItemFileName(item)).toBe('Series Name - S3E15');

		item.Name = 'Episode Name';
		expect(getItemFileName(item)).toBe('Series Name - S3E15 - Episode Name');
	});

	it('should fallback to name and year when possible', () => {
		const item = {
			Name: 'Item Name'
		};
		expect(getItemFileName(item)).toBe('Item Name');

		item.ProductionYear = 2025;
		expect(getItemFileName(item)).toBe('Item Name (2025)');
	});

	it('should return undefined when no name or year is present', () => {
		expect(getItemFileName({ Name: '   ' })).toBeUndefined();

		expect(getItemFileName({})).toBeUndefined();
	});
});
