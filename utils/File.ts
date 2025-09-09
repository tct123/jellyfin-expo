/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as FileSystem from 'expo-file-system';

const INVALID_DIR_CHARS = /[\\/:*?"<>|.]/g;
const INVALID_FILE_CHARS = /[\\/:*?"<>|]/g;

/**
 * Checks if a path exists, and creates a directory (including missing intermediate directories) if it does not.
 * @param path A uri of a local directory
 */
export async function ensurePathExists(path: string) {
	const info = await FileSystem.getInfoAsync(path);
	if (!info.exists) {
		await FileSystem.makeDirectoryAsync(path, { intermediates: true });
	}
}

/** Trim and replace any invalid characters in a directory name. */
export function sanitizeDirName(name?: string) {
	const trimmed = name?.trim();
	if (!trimmed) return;

	return trimmed.replace(INVALID_DIR_CHARS, '-');
}

/** Trim and replace any invalid characters in a file name. */
export function sanitizeFileName(name?: string) {
	const trimmed = name?.trim();
	if (!trimmed) return;

	return trimmed.replace(INVALID_FILE_CHARS, '-');
}
