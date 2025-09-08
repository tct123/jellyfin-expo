/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { MediaType } from '@jellyfin/sdk/lib/generated-client/models/media-type';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { Button, ThemeContext } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import DownloadListItem from '../components/DownloadListItem';
import ErrorView from '../components/ErrorView';
import { Screens } from '../constants/Screens';
import { useStores } from '../hooks/useStores';
import type DownloadModel from '../models/DownloadModel';

const DownloadScreen = () => {
	const navigation = useNavigation();
	const { downloadStore, mediaStore } = useStores();
	const { t } = useTranslation();
	const { theme } = useContext(ThemeContext);
	const [ isEditMode, setIsEditMode ] = useState(false);
	const [ selectedItems, setSelectedItems ] = useState<DownloadModel[]>([]);

	const exitEditMode = useCallback(() => {
		setIsEditMode(false);
		setSelectedItems([]);
	}, []);

	const deleteItem = useCallback(async (download: DownloadModel) => {
		// TODO: Add user messaging on errors
		try {
			// If the download is in a (potentially) shared directory, only delete the file
			if (download.isSharedPath) await FileSystem.deleteAsync(download.uri);
			// Otherwise delete the entire directory
			else await FileSystem.deleteAsync(encodeURI(download.localPath));
			// Delete the store value
			downloadStore.delete(download);
			console.log('[DownloadScreen] download "%s" deleted', download.title);
		} catch (e) {
			console.error('[DownloadScreen] Failed to delete download', e);
		}
	}, [ downloadStore ]);

	const onDeleteItems = useCallback((downloads: DownloadModel[]) => {
		Alert.alert(
			t('alerts.deleteDownloads.title'),
			t('alerts.deleteDownloads.description'),
			[
				{
					text: t('common.cancel'),
					onPress: exitEditMode
				},
				{
					text: t('alerts.deleteDownloads.confirm', { downloadCount: downloads.length }),
					onPress: () => {
						return Promise.allSettled(downloads.map(deleteItem))
							.finally(exitEditMode);
					},
					style: 'destructive'
				}
			]
		);
	}, [ deleteItem, exitEditMode, t ]);

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				isEditMode ?
					<Button
						title={t('common.cancel')}
						type='clear'
						onPress={exitEditMode}
						style={styles.leftButton}
					/> :
					null
			),
			headerRight: () => (
				isEditMode ?
					<Button
						title={t('common.delete')}
						type='clear'
						style={styles.rightButton}
						disabled={selectedItems.length < 1}
						onPress={() => {
							onDeleteItems(selectedItems);
						}}
					/> :
					<Button
						title={t('common.edit')}
						type='clear'
						style={styles.rightButton}
						disabled={downloadStore.downloads.size < 1}
						onPress={() => {
							setIsEditMode(true);
						}}
					/>
			)
		});
	}, [ navigation, isEditMode, onDeleteItems, selectedItems, downloadStore.downloads, t ]);

	useFocusEffect(
		useCallback(() => {
			downloadStore.downloads
				.forEach(download => {
					if (download.isNew && download.isNew !== !download.isComplete) {
						download.isNew = !download.isComplete;
						downloadStore.update(download);
					}
				});
		}, [ downloadStore.downloads ])
	);

	return (
		<SafeAreaView
			style={{
				...styles.container,
				backgroundColor: theme.colors?.background
			}}
			edges={[ 'right', 'left' ]}
		>
			{downloadStore.downloads.size > 0 ? (
				<FlatList
					data={Array.from(downloadStore.downloads.values())}
					extraData={downloadStore.downloads}
					renderItem={({ item, index }) => (
						<DownloadListItem
							item={item}
							index={index}
							isEditMode={isEditMode}
							isSelected={selectedItems.some(s => s.key === item.key)}
							onSelect={() => {
								setSelectedItems(prev => (
									prev.some(s => s.key === item.key)
										? prev.filter(s => s.key !== item.key)
										: [ ...prev, item ]
								));
							}}
							onPlay={() => {
								item.isNew = false;
								downloadStore.update(item);
								mediaStore.set({
									isLocalFile: true,
									type: MediaType.Video,
									uri: item.uri
								});
							}}
							onDelete={() => {
								onDeleteItems([ item ]);
							}}
						/>
					)}
					keyExtractor={item => `download-${item.key}`}
					contentContainerStyle={styles.listContainer}
				/>
			) : (
				<ErrorView
					icon={{
						name: 'download-circle-outline',
						type: 'material-community'
					}}
					heading={t('downloads.noDownloads.heading')}
					message={t('downloads.noDownloads.description')}
				/>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	listContainer: {
		marginTop: 1
	},
	leftButton: {
		marginLeft: 8
	},
	rightButton: {
		marginRight: 8
	}
});

DownloadScreen.displayName = Screens.DownloadsTab;

export default DownloadScreen;
