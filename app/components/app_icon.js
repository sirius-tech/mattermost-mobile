// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Svg, {
    G,
    Path,
} from 'react-native-svg';

export default class AppIcon extends PureComponent {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
    };

    render() {
        return (
            <Svg
                height={this.props.height}
                width={this.props.width}
                viewBox='0 0 500 500'
            >
                <G id='XMLID_1_'> 
                    <Path
                        id='XMLID_2_'
                        class='st0'
                        d='M75,75 L425,75 L425,425 L75,425 L75,75Z M92.4658869,92.4658869 L92.4658869,407.534113 L407.534113,407.534113 L407.534113,92.4658869 L92.4658869,92.4658869 Z M139.645299,197.726946 L139.645299,171.630454 L215.035163,202.332209 L215.035163,225.017394 L139.645299,255.719148 L139.645299,229.537374 L186.721323,214.101215 L186.721323,213.589519 L139.645299,197.726946 Z M295.968399,281.559792 L218.958165,281.559792 L218.958165,260.153846 L295.968399,260.153846 L295.968399,281.559792Z'
                        fill={this.props.color}
                    />
                </G>
            </Svg>
        );
    }
}
