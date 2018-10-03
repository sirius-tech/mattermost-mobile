// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {handleRemoveChannelMembers} from 'app/actions/views/channel_members';
import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentChannel, canManageChannelMembers} from 'mattermost-redux/selectors/entities/channels';
import {makeGetProfilesInChannel} from 'mattermost-redux/selectors/entities/users';
import {getProfilesInChannel, searchProfiles} from 'mattermost-redux/actions/users';

import ChannelMembers from './channel_members';

import {getCurrentUserRoles} from 'mattermost-redux/selectors/entities/users';
import {isAdmin as checkIsAdmin, isChannelAdmin as checkIsChannelAdmin, isSystemAdmin as checkIsSystemAdmin} from 'mattermost-redux/utils/user_utils';

function makeMapStateToProps() {
    const getChannelMembers = makeGetProfilesInChannel();

    return (state) => {
        const currentChannel = getCurrentChannel(state) || {}; 
        const roles = getCurrentUserRoles(state);
        const isChannelAdmin = checkIsChannelAdmin(roles);
        const canManageUsers = isChannelAdmin; //canManageChannelMembers(state);
        let currentChannelMembers = [];
        if (currentChannel) {
            currentChannelMembers = getChannelMembers(state, currentChannel.id, true);
        }

        return {
            theme: getTheme(state),
            currentChannel,
            currentChannelMembers,
            currentUserId: state.entities.users.currentUserId,
            requestStatus: state.requests.users.getProfilesInChannel.status,
            searchRequestStatus: state.requests.users.searchProfiles.status,
            removeMembersStatus: state.requests.channels.removeChannelMember.status,
            canManageUsers: canManageUsers,
        };
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getProfilesInChannel,
            handleRemoveChannelMembers,
            searchProfiles,
        }, dispatch),
    };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(ChannelMembers);
