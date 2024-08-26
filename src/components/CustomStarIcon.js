import React from 'react';
import { Image } from 'react-native';
import { emptyStar, fullStar } from '../assets/images';


const CustomStarIcon = ({ size, color, type }) => {
    let source;

    switch (type) {
        case 'full':
            source = fullStar;
            break;
        // case 'half':
        //     source = halfStarImage;
        //     break;
        case 'empty':
            source = emptyStar;
            break;
        default:
            source = emptyStar;
    }

    return <Image resizeMode='contain' style={{ width: size, height: size, tintColor: color }} source={source} />;
};

export default CustomStarIcon;