/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { FC } from 'react';
import { ActivityIndicator } from 'react-native';
import { Button, ListItem } from 'react-native-elements';

import type DownloadModel from '../models/DownloadModel';
import { getIconName } from '../utils/Icons';

interface DownloadListItemProps {
	item: DownloadModel;
	index: number;
	onSelect: (item: DownloadModel) => void;
	onPlay: (item: DownloadModel) => void;
	isEditMode?: boolean;
	isSelected?: boolean;
}

const DownloadListItem: FC<DownloadListItemProps> = ({
	item,
	index,
	onSelect,
	onPlay,
	isEditMode = false,
	isSelected = false
}) => (
	<ListItem
		topDivider={index === 0}
		bottomDivider
	>
		{isEditMode &&
			<ListItem.CheckBox
				testID='select-checkbox'
				onPress={() => onSelect(item)}
				checked={isSelected}
			/>
		}
		<ListItem.Content>
			<ListItem.Title testID='title'>
				{item.title}
			</ListItem.Title>
			<ListItem.Subtitle testID='subtitle'>
				{item.localFilename}
			</ListItem.Subtitle>
		</ListItem.Content>
		{item.isComplete ?
			<Button
				testID='play-button'
				type='clear'
				icon={{
					name: getIconName('play'),
					type: 'ionicon'
				}}
				disabled={isEditMode}
				onPress={() => onPlay(item)}
			/> :
			<ActivityIndicator testID='loading-indicator' />
		}
	</ListItem>
);

DownloadListItem.displayName = 'DownloadListItem';

export default DownloadListItem;
