/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { DownloadAction } from '../constants/DownloadAction';

export interface DownloadItemAction {
	/** The unique ID of the action. */
	id: DownloadAction;
	/** The localization key to use for the UI title. */
	title: string;
	/** The SFSymbols image name. */
	image?: string;
	/**
	 * If the action should be used as the default when pressing an item.
	 * If more than one defaults exist, the first should be used.
	 */
	isDefault?: boolean;
	/** If the action should be highlighted as destructive in the UI. */
	isDestructive?: boolean;
	/** If the action is enabled. Actions that are not enabled will show as disabled in the UI. */
	isEnabled: boolean;
	/** If the action is supported. Unsupported actions will be removed from the UI. */
	isSupported: boolean;
}
