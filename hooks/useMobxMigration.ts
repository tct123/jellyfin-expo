/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { PublicSystemInfo } from '@jellyfin/sdk/lib/generated-client/models/public-system-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';

import DownloadModel, { fromStorageObject, type MobxDownloadModel } from '../models/DownloadModel';
import ServerModel from '../models/ServerModel';

import { useStores } from './useStores';

interface MobxServerModel {
	id: string;
	url: string;
	info: PublicSystemInfo;
}

interface MobxStore {
	deviceId?: string;
	downloadStore: {
		downloads: Record<string, MobxDownloadModel>;
	};
	serverStore: {
		servers: MobxServerModel[];
	};
	settingStore: Record<string, object>;
}

// Storage key for the migration status
const ZUSTAND_MIGRATED = '__zustand_migrated__';
// Track migration state with a version in case we encounter errors with the migration
const ZUSTAND_MIGRATION_VERSION = 2;

export const useMobxMigration = () => {
	const { rootStore, downloadStore, settingStore, serverStore } = useStores();
	const [ isMigrated, setIsMigrated ] = useState(false);

	const migrateDownloadStore = useCallback((mobxStore: MobxStore) => {
		const mobxDownloads = mobxStore.downloadStore.downloads;
		const downloads = new Map<string, DownloadModel>();
		if (Object.keys(mobxDownloads).length > 0) {
			for (const [ key, value ] of Object.entries(mobxDownloads)) {
				downloads.set(key, fromStorageObject(value));
			}
		}
		downloadStore.set({ downloads });
	}, []);

	const migrateRootStore = useCallback((mobxStore: MobxStore) => {
		if (mobxStore.deviceId) {
			rootStore.set({ deviceId: mobxStore.deviceId });
		}
	}, []);

	const migrateServerStore = useCallback((mobxStore: MobxStore) => {
		const mobxServers = mobxStore.serverStore.servers;
		const servers: ServerModel[] = [];
		if (Object.keys(mobxServers).length > 0) {
			for (const item of mobxServers) {
				servers.push(new ServerModel(item.id, new URL(item.url), item.info));
			}
		}
		serverStore.set({ servers });
	}, []);

	const migrateSettingStore = useCallback((mobxStore: MobxStore) => {
		for (const key of Object.keys(mobxStore.settingStore)) {
			console.info('SettingStore', key);
			settingStore.set({ [key]: mobxStore.settingStore[key] });
		}
	}, []);

	const migrateStores = useCallback(async () => {
		// TODO: In release n+2 from this point, remove this conversion code.
		const zustandMigratedVersion = parseInt(await AsyncStorage.getItem(ZUSTAND_MIGRATED) || '0', 10);
		const mobxStoreValue = await AsyncStorage.getItem('__mobx_sync__'); // Store will be null if it's not set

		console.info('zustand migration version', zustandMigratedVersion);

		if (zustandMigratedVersion < ZUSTAND_MIGRATION_VERSION && mobxStoreValue !== null) {
			console.info('Migrating mobx store to zustand');
			const mobxStore = JSON.parse(mobxStoreValue);
			// Migrate each data store
			migrateRootStore(mobxStore);
			migrateDownloadStore(mobxStore);
			migrateServerStore(mobxStore);
			migrateSettingStore(mobxStore);

			// TODO: Remove mobx sync item from async storage in a future release
			// AsyncStorage.removeItem('__mobx_sync__');

			// Migration completed; store the migration version
			await AsyncStorage.setItem(ZUSTAND_MIGRATED, `${ZUSTAND_MIGRATION_VERSION}`);
		}

		setIsMigrated(true);
	}, [ migrateDownloadStore, migrateRootStore, migrateServerStore, migrateSettingStore ]);

	return {
		migrateStores,
		isMigrated
	};
};
