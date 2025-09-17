/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { MenuAction } from '@react-native-menu/menu';
import React, { useCallback, useContext, useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';
import { ListItem, ThemeContext } from 'react-native-elements';

import { DownloadStatus } from '../constants/DownloadStatus';
import { useStores } from '../hooks/useStores';
import type DownloadModel from '../models/DownloadModel';
import { getIconName } from '../utils/Icons';

import MenuViewButton from './MenuViewButton';
import { MenuPressEvent } from './MenuViewButton/types';

interface DownloadStatusIndicatorProps {
	download: DownloadModel;
	canPlayInApp: boolean;
	isEditMode?: boolean;
	onDelete: () => void;
	onPlay: () => void;
}

const DownloadAction = {
	Delete: 'delete',
	PlayInApp: 'play_in_app'
} as const;

const DownloadStatusIndicator: FC<DownloadStatusIndicatorProps> = ({
	download,
	canPlayInApp,
	isEditMode = false,
	onDelete,
	onPlay
}) => {
	const { settingStore } = useStores();
	const { theme } = useContext(ThemeContext);
	const { t } = useTranslation();

	const menuActions = useMemo<MenuAction[]>(() => {
		const actions: MenuAction[] = [];

		if (canPlayInApp) {
			actions.push({
				id: DownloadAction.PlayInApp,
				title: t('common.play'),
				image: 'play'
			});
		}

		return [
			...actions,
			{
				id: DownloadAction.Delete,
				title: t('common.delete'),
				attributes: {
					destructive: true
				},
				image: 'trash'
			}
		];
	}, [ canPlayInApp, t ]);

	const onMenuPress = useCallback(({ nativeEvent }: MenuPressEvent) => {
		switch (nativeEvent.event) {
			case DownloadAction.PlayInApp:
				return onPlay();
			case DownloadAction.Delete:
				return onDelete();
			default:
				console.warn('[DownloadStatusIndicator.onMenuPress] unhandled menu press action', nativeEvent.event);
		}
	}, [ onDelete, onPlay ]);

	switch (download.status) {
		case DownloadStatus.Complete:
			return (
				<MenuViewButton
					testID='menu-view'
					actions={menuActions}
					onPressAction={onMenuPress}
					shouldOpenOnLongPress={false}
					themeVariant={
						settingStore.getTheme().dark ? 'dark' : 'light'
					}
					disabled={isEditMode}
				/>
			);
		case DownloadStatus.Downloading:
			return (
				<ActivityIndicator
					testID='loading-indicator'
					style={{
						alignSelf: 'center'
					}}
				/>
			);
		case DownloadStatus.Failed:
			return (
				<ListItem.Chevron
					testID='failed-icon'
					type='ionicon'
					name={getIconName('warning')}
					color={theme.colors?.error}
				/>
			);
		case DownloadStatus.Pending:
			return (
				<ListItem.Chevron
					type='ionicon'
					name='cloud-download-outline'
					color={theme.colors?.black}
				/>
			);
		default:
			return (
				<ListItem.Chevron
					type='ionicon'
					name={getIconName('help-circle')}
					color={theme.colors?.black}
				/>
			);
	}
};

DownloadStatusIndicator.displayName = 'DownloadStatusIndicator';
export default DownloadStatusIndicator;
