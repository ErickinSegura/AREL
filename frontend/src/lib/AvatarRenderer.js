import React from 'react';

/**
 * Componente para renderizar un avatar basado en la configuración proporcionada
 * @param {Object} props - Props del componente
 * @param {Object} props.config - Configuración del avatar (opciones seleccionadas)
 * @param {number} props.size - Tamaño del avatar en píxeles
 * @param {string} props.className - Clases adicionales
 */
export const AvatarRenderer = ({ config, size = 100, className = '' }) => {
    // Valores por defecto si no se proporciona configuración
    const defaultConfig = {
        background: "bg1",
        skin: "skin1",
        eyes: "eyes1",
        eyeColor: "eyeColor1",
        hairstyle: "hair1",
        hairColor: "hairColor1",
        mouth: "mouth1",
        accessories: "acc1",
        facialHair: "facial1"
    };

    // Usar configuración proporcionada o valores por defecto
    const avatarConfig = config || defaultConfig;

    // Función para obtener el estilo del componente del avatar
    const getBackgroundColor = () => {
        // Mapeo de IDs a colores reales
        const backgroundColors = {
            bg1: "#e6f7ff",
            bg2: "#e6ffed",
            bg3: "#f5e6ff",
            bg4: "#fffbe6",
            bg5: "#ffe6f0"
        };

        return backgroundColors[avatarConfig.background] || backgroundColors.bg1;
    };

    const getSkinColor = () => {
        const skinColors = {
            skin1: "#ffdbac",
            skin2: "#f1c27d",
            skin3: "#c68642",
            skin4: "#8d5524",
            skin5: "#603601"
        };

        return skinColors[avatarConfig.skin] || skinColors.skin1;
    };

    const getEyeColor = () => {
        const eyeColors = {
            eyeColor1: "#613613",
            eyeColor2: "#1f75fe",
            eyeColor3: "#308446",
            eyeColor4: "#ffbf00",
            eyeColor5: "#808080"
        };

        return eyeColors[avatarConfig.eyeColor] || eyeColors.eyeColor1;
    };

    const getHairColor = () => {
        const hairColors = {
            hairColor1: "#090806",
            hairColor2: "#654321",
            hairColor3: "#deb887",
            hairColor4: "#b55239",
            hairColor5: "#808080",
            hairColor6: "#4169e1",
            hairColor7: "#2e8b57",
            hairColor8: "#9370db"
        };

        return hairColors[avatarConfig.hairColor] || hairColors.hairColor1;
    };

    // Renderizar el componente SVG del avatar
    return (
        <div
            className={`avatar-container ${className}`}
            style={{ width: size, height: size }}
        >
            <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
            >
                {/* Fondo */}
                <circle cx="100" cy="100" r="100" fill={getBackgroundColor()} />

                {/* Cabeza */}
                <circle cx="100" cy="100" r="70" fill={getSkinColor()} />

                {/* Cabello */}
                {renderHair(avatarConfig.hairstyle, getHairColor())}

                {/* Ojos */}
                {renderEyes(avatarConfig.eyes, getEyeColor())}

                {/* Boca */}
                {renderMouth(avatarConfig.mouth)}

                {/* Vello facial */}
                {renderFacialHair(avatarConfig.facialHair, getHairColor())}

                {/* Accesorios */}
                {renderAccessories(avatarConfig.accessories)}
            </svg>
        </div>
    );
};

// Función para renderizar diferentes estilos de cabello
const renderHair = (hairstyleId, color) => {
    switch (hairstyleId) {
        case 'hair1': // Corto
            return (
                <path
                    d="M30,80 Q45,45 100,45 Q155,45 170,80"
                    fill={color}
                    strokeWidth="0"
                />
            );
        case 'hair2': // Medio
            return (
                <path
                    d="M30,80 Q45,35 100,35 Q155,35 170,80 Q170,100 170,110 Q165,120 155,120 L145,120 L145,90 L55,90 L55,120 L45,120 Q35,120 30,110 Q30,100 30,80"
                    fill={color}
                    strokeWidth="0"
                />
            );
        case 'hair3': // Largo
            return (
                <path
                    d="M30,80 Q45,35 100,35 Q155,35 170,80 Q170,100 170,140 Q165,150 155,150 L145,150 L145,90 L55,90 L55,150 L45,150 Q35,150 30,140 Q30,100 30,80"
                    fill={color}
                    strokeWidth="0"
                />
            );
        case 'hair4': // Rizado
            return (
                <g>
                    <path
                        d="M30,80 Q45,35 100,35 Q155,35 170,80"
                        fill={color}
                        strokeWidth="0"
                    />
                    <circle cx="40" cy="60" r="10" fill={color} />
                    <circle cx="55" cy="45" r="12" fill={color} />
                    <circle cx="75" cy="38" r="10" fill={color} />
                    <circle cx="95" cy="35" r="12" fill={color} />
                    <circle cx="115" cy="35" r="10" fill={color} />
                    <circle cx="135" cy="40" r="12" fill={color} />
                    <circle cx="155" cy="50" r="10" fill={color} />
                    <circle cx="165" cy="65" r="8" fill={color} />
                </g>
            );
        case 'hair5': // Calvo
            return null;
        case 'hair6': // Coleta
            return (
                <g>
                    <path
                        d="M30,80 Q45,35 100,35 Q155,35 170,80"
                        fill={color}
                        strokeWidth="0"
                    />
                    <path
                        d="M100,35 Q110,40 115,60 Q120,90 118,140 Q115,150 110,150 Q105,150 100,140 Q95,150 90,150 Q85,150 82,140 Q80,90 85,60 Q90,40 100,35"
                        fill={color}
                        strokeWidth="0"
                    />
                </g>
            );
        default:
            return null;
    }
};

// Función para renderizar diferentes estilos de ojos
const renderEyes = (eyesId, color) => {
    const irisColor = color;
    const pupilColor = "#000000";
    const whiteColor = "#FFFFFF";

    switch (eyesId) {
        case 'eyes1': // Redondos
            return (
                <g>
                    {/* Ojo izquierdo */}
                    <circle cx="75" cy="85" r="10" fill={whiteColor} />
                    <circle cx="75" cy="85" r="5" fill={irisColor} />
                    <circle cx="75" cy="85" r="2" fill={pupilColor} />

                    {/* Ojo derecho */}
                    <circle cx="125" cy="85" r="10" fill={whiteColor} />
                    <circle cx="125" cy="85" r="5" fill={irisColor} />
                    <circle cx="125" cy="85" r="2" fill={pupilColor} />
                </g>
            );
        case 'eyes2': // Almendrados
            return (
                <g>
                    {/* Ojo izquierdo */}
                    <ellipse cx="75" cy="85" rx="12" ry="8" fill={whiteColor} />
                    <ellipse cx="75" cy="85" rx="6" ry="4" fill={irisColor} />
                    <ellipse cx="75" cy="85" rx="2" ry="2" fill={pupilColor} />

                    {/* Ojo derecho */}
                    <ellipse cx="125" cy="85" rx="12" ry="8" fill={whiteColor} />
                    <ellipse cx="125" cy="85" rx="6" ry="4" fill={irisColor} />
                    <ellipse cx="125" cy="85" rx="2" ry="2" fill={pupilColor} />
                </g>
            );
        case 'eyes3': // Entrecerrados
            return (
                <g>
                    {/* Ojo izquierdo */}
                    <ellipse cx="75" cy="85" rx="12" ry="4" fill={whiteColor} />
                    <ellipse cx="75" cy="85" rx="6" ry="2" fill={irisColor} />
                    <ellipse cx="75" cy="85" rx="2" ry="1" fill={pupilColor} />

                    {/* Ojo derecho */}
                    <ellipse cx="125" cy="85" rx="12" ry="4" fill={whiteColor} />
                    <ellipse cx="125" cy="85" rx="6" ry="2" fill={irisColor} />
                    <ellipse cx="125" cy="85" rx="2" ry="1" fill={pupilColor} />
                </g>
            );
        case 'eyes4': // Grandes
            return (
                <g>
                    {/* Ojo izquierdo */}
                    <circle cx="75" cy="85" r="15" fill={whiteColor} />
                    <circle cx="75" cy="85" r="8" fill={irisColor} />
                    <circle cx="75" cy="85" r="3" fill={pupilColor} />

                    {/* Ojo derecho */}
                    <circle cx="125" cy="85" r="15" fill={whiteColor} />
                    <circle cx="125" cy="85" r="8" fill={irisColor} />
                    <circle cx="125" cy="85" r="3" fill={pupilColor} />
                </g>
            );
        default:
            return null;
    }
};

// Función para renderizar diferentes estilos de boca
const renderMouth = (mouthId) => {
    const lipColor = "#c93756";

    switch (mouthId) {
        case 'mouth1': // Sonrisa
            return (
                <path
                    d="M75,120 Q100,140 125,120"
                    fill="none"
                    stroke={lipColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            );
        case 'mouth2': // Neutral
            return (
                <line
                    x1="75"
                    y1="120"
                    x2="125"
                    y2="120"
                    stroke={lipColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            );
        case 'mouth3': // Asombro
            return (
                <circle
                    cx="100"
                    cy="120"
                    r="10"
                    fill={lipColor}
                    opacity="0.8"
                />
            );
        case 'mouth4': // Amplia sonrisa
            return (
                <path
                    d="M70,115 Q100,145 130,115"
                    fill={lipColor}
                    strokeWidth="0"
                    opacity="0.8"
                />
            );
        default:
            return null;
    }
};

// Función para renderizar accesorios
const renderAccessories = (accessoryId) => {
    switch (accessoryId) {
        case 'acc2': // Gafas redondas
            return (
                <g>
                    <circle cx="75" cy="85" r="15" fill="none" stroke="#000000" strokeWidth="2" />
                    <circle cx="125" cy="85" r="15" fill="none" stroke="#000000" strokeWidth="2" />
                    <line x1="90" y1="85" x2="110" y2="85" stroke="#000000" strokeWidth="2" />
                </g>
            );
        case 'acc3': // Gafas de sol
            return (
                <g>
                    <rect x="60" y="75" width="30" height="20" rx="5" fill="#000000" opacity="0.7" />
                    <rect x="110" y="75" width="30" height="20" rx="5" fill="#000000" opacity="0.7" />
                    <line x1="90" y1="85" x2="110" y2="85" stroke="#000000" strokeWidth="2" />
                </g>
            );
        case 'acc4': // Gafas cuadradas
            return (
                <g>
                    <rect x="60" y="75" width="30" height="20" rx="2" fill="none" stroke="#000000" strokeWidth="2" />
                    <rect x="110" y="75" width="30" height="20" rx="2" fill="none" stroke="#000000" strokeWidth="2" />
                    <line x1="90" y1="85" x2="110" y2="85" stroke="#000000" strokeWidth="2" />
                </g>
            );
        case 'acc5': // Sombrero
            return (
                <g>
                    <ellipse cx="100" cy="45" rx="70" ry="10" fill="#333333" />
                    <path
                        d="M70,45 Q100,25 130,45"
                        fill="#333333"
                        strokeWidth="0"
                    />
                </g>
            );
        case 'acc1': // Ninguno
        default:
            return null;
    }
};

// Función para renderizar vello facial
const renderFacialHair = (facialHairId, color) => {
    switch (facialHairId) {
        case 'facial2': // Barba corta
            return (
                <path
                    d="M70,120 Q100,140 130,120 L130,145 Q100,160 70,145 Z"
                    fill={color}
                    strokeWidth="0"
                    opacity="0.9"
                />
            );
        case 'facial3': // Barba larga
            return (
                <path
                    d="M70,120 Q100,140 130,120 L135,165 Q100,180 65,165 Z"
                    fill={color}
                    strokeWidth="0"
                    opacity="0.9"
                />
            );
        case 'facial4': // Bigote
            return (
                <path
                    d="M75,110 Q100,120 125,110 Q100,117 75,110"
                    fill={color}
                    strokeWidth="0"
                    opacity="0.9"
                />
            );
        case 'facial5': // Perilla
            return (
                <path
                    d="M95,120 Q100,122 105,120 L105,140 Q100,145 95,140 Z"
                    fill={color}
                    strokeWidth="0"
                    opacity="0.9"
                />
            );
        case 'facial1': // Ninguno
        default:
            return null;
    }
};

