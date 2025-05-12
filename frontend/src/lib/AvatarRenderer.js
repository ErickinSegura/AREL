import React from 'react';

export const AvatarRenderer = ({ config, size, className = '' }) => {
    const defaultConfig = {
        background: "bg1",
        skin: "skin1",
        eyes: "eyes1",
        eyeColor: "eyeColor1",
        spineColor: "spineColor1",
        mouth: "mouth1",
        accessories: "acc1",
        bellyColor: "bellyColor1"
    };

    const avatarConfig = config ?
        (typeof config === 'string' ? JSON.parse(config) : config)
        : defaultConfig;

    const getImagePath = (type, id) => {
        return `/assets/avatar/${type}/${id}.png`;
    };

    // Eliminamos los estilos inline basados en size
    const containerStyle = {
        position: 'relative',
        width: '100%',
        height: '100%'
    };

    const imageStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        imageRendering: 'pixelated'
    };

    return (
        <div className={`avatar-container ${className}`} style={containerStyle}>
            <img
                src={getImagePath('backgrounds', avatarConfig.background)}
                alt="Background"
                style={imageStyle}
            />

            <img
                src={getImagePath('skins', avatarConfig.skin)}
                alt="Skin"
                style={imageStyle}
            />

            <img
                src={getImagePath('eyes', `${avatarConfig.eyes}_${avatarConfig.eyeColor}`)}
                alt="Eyes"
                style={imageStyle}
            />

            <img
                src={getImagePath('mouths', avatarConfig.mouth)}
                alt="Mouth"
                style={imageStyle}
            />

            <img
                src={getImagePath('spines', avatarConfig.spineColor)}
                alt="Spines"
                style={imageStyle}
            />

            <img
                src={getImagePath('bellies', avatarConfig.bellyColor)}
                alt="Belly"
                style={imageStyle}
            />

            {avatarConfig.accessories !== 'acc1' && (
                <img
                    src={getImagePath('accessories', avatarConfig.accessories)}
                    alt="Accessories"
                    style={imageStyle}
                />
            )}
        </div>
    );
};