/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useContext, useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';

import { Icon, ThemeContext } from 'react-native-elements';

import { DownloadStatus } from '../constants/DownloadStatus';
import { useStores } from '../hooks/useStores';
import type DownloadModel from '../models/DownloadModel';
import { getIconName } from '../utils/Icons';

import MenuViewButton from './MenuViewButton';
import { MenuPressEvent } from './MenuViewButton/types';

interface DownloadStatusIndicatorProps {
	download: DownloadModel;
	isEditMode?: boolean;
	onDelete: () => void;
	onPlay: () => void;
}

const MenuAction = {
	Delete: 'delete',
	PlayInApp: 'play_in_app'
} as const;

const DownloadStatusIndicator: FC<DownloadStatusIndicatorProps> = ({
	download,
	isEditMode = false,
	onDelete,
	onPlay
}) => {
	const { settingStore } = useStores();
	const { theme } = useContext(ThemeContext);
	const { t } = useTranslation();

	const menuActions = useMemo(() => [
		{
			id: MenuAction.PlayInApp,
			title: t('common.play'),
			image: 'play'
		},
		{
			id: MenuAction.Delete,
			title: t('common.delete'),
			attributes: {
				destructive: true
			},
			image: 'trash'
		}
	], [ t ]);

	const onMenuPress = useCallback(({ nativeEvent }: MenuPressEvent) => {
		switch (nativeEvent.event) {
			case MenuAction.PlayInApp:
				return onPlay();
			case MenuAction.Delete:
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
			return <ActivityIndicator testID='loading-indicator' />;
		case DownloadStatus.Failed:
			return (
				<Icon
					testID='failed-icon'
					type='ionicon'
					name={getIconName('warning')}
					color={theme.colors?.error}
				/>
			);
		default:
			return (
				<Icon
					type='ionicon'
					name={getIconName('help-circle')}
				/>
			);
	}
};

DownloadStatusIndicator.displayName = 'DownloadStatusIndicator';
export default DownloadStatusIndicator;
