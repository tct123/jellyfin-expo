/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Screens } from '../constants/Screens';

export type AppStackParams = {
	[Screens.MainScreen]: {
		screen?: string;
		params?: {
			screen?: string;
			params?: {
				activeServer: number;
			}
		}
	};
	[Screens.AddServerScreen]: undefined;
};
