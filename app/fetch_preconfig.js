// Copyright (c) 2018-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {Platform} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';

import {Client4} from 'mattermost-redux/client';
import {General} from 'mattermost-redux/constants';
import EventEmitter from 'mattermost-redux/utils/event_emitter';

import mattermostBucket from 'app/mattermost_bucket';
import LocalConfig from 'assets/config';

if (Platform.OS === 'ios') {
    const HEADER_X_VERSION_ID = 'X-Version-Id';
    const HEADER_X_CLUSTER_ID = 'X-Cluster-Id';

    Client4.doFetchWithResponse = async (url, options) => {
        const response = await fetch(url, Client4.getOptions(options));
        const headers = response.headers;

        let data;
        try {
            data = await response.json();
        } catch (err) {
            throw {
                intl: {
                    id: 'mobile.request.invalid_response',
                    defaultMessage: 'Received invalid response from the server.',
                },
            };
        }

        // Need to only accept version in the header from requests that are not cached
        // to avoid getting an old version from a cached response
        if (headers[HEADER_X_VERSION_ID] && !headers['Cache-Control']) {
            const serverVersion = headers[HEADER_X_VERSION_ID];
            if (serverVersion && this.serverVersion !== serverVersion) {
                this.serverVersion = serverVersion;
                EventEmitter.emit(General.SERVER_VERSION_CHANGED, serverVersion);
            }
        }

        if (headers[HEADER_X_CLUSTER_ID]) {
            const clusterId = headers[HEADER_X_CLUSTER_ID];
            if (clusterId && this.clusterId !== clusterId) {
                this.clusterId = clusterId;
            }
        }

        if (response.ok) {
            const headersMap = new Map();
            Object.keys(headers).forEach((key) => {
                headersMap.set(key, headers[key]);
            });

            return {
                response,
                headers: headersMap,
                data,
            };
        }

        const msg = data.message || '';

        if (this.logToConsole) {
            console.error(msg); // eslint-disable-line no-console
        }

        throw {
            message: msg,
            server_error_id: data.id,
            status_code: data.status_code,
            url,
        };
    };

    mattermostBucket.getPreference('cert', LocalConfig.AppGroupId).then((certificate) => {
        window.fetch = new RNFetchBlob.polyfill.Fetch({
            auto: true,
            certificate,
        }).build();
    });
}
