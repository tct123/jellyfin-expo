/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getInfoAsync, makeDirectoryAsync } from 'expo-file-system';

import { ensurePathExists, sanitizeDirName, sanitizeFileName } from '../File';

jest.mock('expo-file-system');

describe('File', () => {
	beforeEach(() => {
		jest.resetModules();
		jest.clearAllMocks();
	});

	describe('ensurePathExists', () => {
		it('should not try to create an existing directory', async () => {
			getInfoAsync.mockResolvedValue({ exists: true });

			await ensurePathExists('test');

			expect(getInfoAsync).toHaveBeenCalled();
			expect(makeDirectoryAsync).not.toHaveBeenCalled();
		});

		it('should create a directory if it does not exist', async () => {
			getInfoAsync.mockResolvedValue({ exists: false });
			makeDirectoryAsync.mockResolvedValue(true);

			await ensurePathExists('test');

			expect(getInfoAsync).toHaveBeenCalled();
			expect(makeDirectoryAsync).toHaveBeenCalled();
		});
	});

	describe('sanitizeDirName', () => {
		it('should sanitize directory names', () => {
			let name = sanitizeDirName(' Q: A.? ');
			expect(name).toBe('Q- A');

			name = sanitizeDirName('AC/DC');
			expect(name).toBe('AC-DC');
		});
	});

	describe('sanitizeFileName', () => {
		it('should sanitize file names', () => {
			let name = sanitizeFileName(' *<>Q: A?.mp3 ');
			expect(name).toBe('Q- A-.mp3');

			name = sanitizeFileName('AC/DC');
			expect(name).toBe('AC-DC');
		});
	});
});
