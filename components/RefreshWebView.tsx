/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { Dimensions, RefreshControl, type RefreshControlProps, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { WebView, type WebViewProps } from 'react-native-webview';

export interface RefreshWebViewProps extends WebViewProps {
	isRefreshing: boolean;
	onRefresh?: () => void;
	refreshControlProps?: Omit<RefreshControlProps, 'enabled' | 'onRefresh' | 'refreshing'>;
}

/**
 * A WebView component that supports pulling to refresh.
 */
const RefreshWebView = React.forwardRef<WebView, RefreshWebViewProps>(
	function RefreshWebView({ isRefreshing, onRefresh, refreshControlProps = {}, ...webViewProps }, ref) {
		const [ height, setHeight ] = useState(Dimensions.get('screen').height);
		const [ isEnabled, setEnabled ] = useState(typeof onRefresh === 'function');

		return (
			<ScrollView
				onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
				refreshControl={
					<RefreshControl
						{...refreshControlProps}
						enabled={isEnabled}
						onRefresh={onRefresh}
						refreshing={isRefreshing}
					/>
				}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				style={styles.view}>
				<WebView
					ref={ref}
					{...webViewProps}
					onScroll={(e) =>
						setEnabled(
							typeof onRefresh === 'function' &&
								e.nativeEvent.contentOffset.y <= 0
						)
					}
					style={
						StyleSheet.flatten([
							styles.view,
							{ height },
							webViewProps.style
						])
					}
				/>
			</ScrollView>
		);
	}
);

const styles = StyleSheet.create({
	view: {
		flex: 1,
		height: '100%'
	}
});

RefreshWebView.displayName = 'RefreshWebView';

export default RefreshWebView;
