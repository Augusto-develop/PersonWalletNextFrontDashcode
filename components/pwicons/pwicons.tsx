import React from 'react';
import './pwicons.css';

interface IconProps {
    fontSize?: string; // Propriedade opcional para definir o tamanho da fonte
}

export const NubankIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-nubank" style={{ fontSize }}>
        </div>
    );
};

export const AtacadaoIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-atacadao" style={{ fontSize }}>
            <path className="path1" />
            <path className="path2" />
            <path className="path3" />
            <path className="path4" />
            <path className="path5" />
            <path className="path6" />
            <path className="path7" />
            <path className="path8" />
            <path className="path9" />
            <path className="path10" />
            <path className="path11" />
            <path className="path12" />
            <path className="path13" />
            <path className="path14" />
        </div>
    );
};

export const BrasilcardIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-brasilcard" style={{ fontSize }}>
            <path className="path1" />
            <path className="path2" />
            <path className="path3" />
        </div>
    );
};

export const CaixaIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-banco-caixa" style={{ fontSize }}>
            <path className="path1" />
            <path className="path2" />
            <path className="path3" />
        </div>
    );
};

export const MercadoPagoIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-mercadopago" style={{ fontSize }}>
            <path className="path1" />
            <path className="path2" />
            <path className="path3" />
            <path className="path4" />
            <path className="path5" />
            <path className="path6" />
            <path className="path7" />
            <path className="path8" />
            <path className="path9" />
            <path className="path10" />
            <path className="path11" />
            <path className="path12" />
            <path className="path13" />
            <path className="path14" />
            <path className="path15" />
            <path className="path16" />
            <path className="path17" />
        </div>
    );
};

export const NeonIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-neon" style={{ fontSize }}>
        </div>
    );
};

export const NovuIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-novucard" style={{ fontSize }}>
            <path className="path1" />
            <path className="path2" />
            <path className="path3" />
            <path className="path4" />
            <path className="path5" />
            <path className="path6" />
            <path className="path7" />
        </div>
    );
};

export const OuzeIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-ouze" style={{ fontSize }}>
            <path className="path1" />
            <path className="path2" />
            <path className="path3" />
            <path className="path4" />
        </div>
    );
};

export const RiachueloIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-riachuelo" style={{ fontSize }}>
            <path className="path1" />
            <path className="path2" />
        </div>
    );
};

export const SantanderIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-santander" style={{ fontSize }}>
            <path className="path1" />
            <path className="path2" />
        </div>
    );
};

export const VisaIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-visa" style={{ fontSize }}>
            <path className="path1" />
            <path className="path2" />
            <path className="path3" />
        </div>
    );
};

export const MastercardIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-mastercard" style={{ fontSize }}>
            <path className="path1" />
            <path className="path2" />
            <path className="path3" />
            <path className="path4" />
            <path className="path5" />
        </div>
    );
};

export const BradescodIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-bradesco" style={{ fontSize }}>
            <path className="path1" />
            <path className="path2" />
        </div>
    );
};

export const ItauIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-itau" style={{ fontSize }}>
            <path className="path1" />
            <path className="path2" />
            <path className="path3" />
        </div>
    );
};

export const BancoBrasilIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-banco-brasil" style={{ fontSize }}>
            <path className="path1" />
            <path className="path2" />
        </div>
    );
};

export const PwLogoAvatarIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-pwlogoavatar" style={{ fontSize }}>
            <path className="path1" />
            <path className="path2" />
            <path className="path3" />
            <path className="path4" />
            <path className="path5" />
            <path className="path6" />
        </div>
    );
};

export const PwLogoNameIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-pwlogoname" style={{ fontSize }}>

        </div>
    );
};

export type IconType =
    | 'SANTANDER'
    | 'CAIXA'
    | 'NUBANK'
    | 'MERCADOPAGO'
    | 'ATACADAO'
    | 'NOVUCARD'
    | 'OUZE'
    | 'RIACHUELO'
    | 'BRASILCARD'
    | 'NEON'
    | 'VISA'
    | 'MASTERCARD'
    | 'BRADESCO'
    | 'ITAU'
    | 'BANCOBRASIL';

export const avatarComponents: Record<IconType, React.FC<{ fontSize?: string }>> = {
    SANTANDER: SantanderIcon,
    CAIXA: CaixaIcon,
    NUBANK: NubankIcon,
    MERCADOPAGO: MercadoPagoIcon,
    ATACADAO: AtacadaoIcon,
    NOVUCARD: NovuIcon,
    OUZE: OuzeIcon,
    RIACHUELO: RiachueloIcon,
    BRASILCARD: BrasilcardIcon,
    NEON: NeonIcon,
    VISA: VisaIcon,
    MASTERCARD: MastercardIcon,
    BRADESCO: BradescodIcon,
    ITAU: ItauIcon,
    BANCOBRASIL: BancoBrasilIcon,
};
