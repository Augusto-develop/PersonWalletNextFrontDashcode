import React from 'react';
import './pwicons.css';
import { Emissor, Bandeira } from "@/lib/model/enums";
import { IconType } from "@/lib/model/types";

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

export const C6Icon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-c6" style={{ fontSize }}>
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

export const MidwayIcon: React.FC<IconProps> = ({ fontSize = '32px' }) => {
    return (
        <div className="iconpw-midway" style={{ fontSize }}>
            <path className="path1" />
            <path className="path2" />
            <path className="path3" />                      
        </div>
    );
};

export const avatarComponents: Record<IconType, React.FC<{ fontSize?: string }>> = {
    [Emissor.SANTANDER]: SantanderIcon,
    [Emissor.CAIXA]: CaixaIcon,
    [Emissor.NUBANK]: NubankIcon,
    [Emissor.MERCADOPAGO]: MercadoPagoIcon,
    [Emissor.ATACADAO]: AtacadaoIcon,
    [Emissor.NOVUCARD]: NovuIcon,
    [Emissor.OUZE]: OuzeIcon,
    [Emissor.RIACHUELO]: RiachueloIcon,
    [Emissor.BRASILCARD]: BrasilcardIcon,
    [Emissor.NEON]: NeonIcon,
    [Bandeira.VISA]: VisaIcon,
    [Bandeira.MASTERCARD]: MastercardIcon,
    [Emissor.BRADESCO]: BradescodIcon,
    [Emissor.ITAU]: ItauIcon,
    [Emissor.BANCOBRASIL]: BancoBrasilIcon,
    [Emissor.C6BANK]: C6Icon,
    [Emissor.MIDWAY]: MidwayIcon,
};