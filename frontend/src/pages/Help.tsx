import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Globe, ShieldAlert, CheckSquare, MessageCircle, Mail } from 'lucide-react';
import { Analytics } from '../utils/analytics';

interface Contact {
    type: 'phone' | 'whatsapp' | 'email' | 'website';
    value: string;
}

interface Resource {
    name: string;
    description: string;
    contacts: Contact[];
}

const resources: Record<string, Resource[]> = {
    Kenya: [
        {
            name: 'Childline Kenya',
            description: '24/7 Helpline for children and young people experiencing abuse.',
            contacts: [{ type: 'phone', value: '116' }]
        },
        {
            name: 'Directorate of Criminal Investigations (DCI)',
            description: 'Report cyber harassment and digital abuse to the Kenyan police cybercrime unit.',
            contacts: [{ type: 'website', value: 'https://www.cid.go.ke' }]
        }
    ],
    Nigeria: [
        {
            name: 'Child Protection Helpline Nigeria',
            description: 'Support for children facing abuse, including digital exploitation.',
            contacts: [
                { type: 'phone', value: '0800-123-4567' },
                { type: 'whatsapp', value: '+234-123-456-789' }
            ]
        },
        {
            name: 'Nigerian Cybercrime Advisory Council',
            description: 'Report cybercrimes such as sextortion and online harassment.',
            contacts: [{ type: 'website', value: 'https://www.cybercrime.gov.ng' }]
        }
    ],
    'South Africa': [
        {
            name: 'Childline South Africa',
            description: 'Confidential counseling for children and youth in distress.',
            contacts: [{ type: 'phone', value: '08000 55 555' }]
        },
        {
            name: 'SAPS Cybercrime Unit',
            description: 'Report digital abuse and cyberbullying to South African police.',
            contacts: [{ type: 'website', value: 'https://www.saps.gov.za/crimestop/cybercrime.php' }]
        }
    ],
    Ghana: [
        {
            name: 'Child Helpline Ghana',
            description: 'Support for children experiencing violence and abuse.',
            contacts: [{ type: 'phone', value: '111' }]
        },
        {
            name: 'Cyber Security Authority Ghana',
            description: 'Report cyber threats and digital harassment.',
            contacts: [{ type: 'website', value: 'https://www.csa.gov.gh' }]
        }
    ],
    Uganda: [
        {
            name: 'Child Helpline Uganda',
            description: 'Helpline for children in need of protection and support.',
            contacts: [{ type: 'phone', value: '116' }]
        },
        {
            name: 'Uganda Police Cybercrime Unit',
            description: 'Report online abuse and cybercrimes.',
            contacts: [{ type: 'website', value: 'https://www.ugandapolice.go.ug' }]
        }
    ]
};

export const Help: React.FC = () => {
    const navigate = useNavigate();
    const [country, setCountry] = useState('Kenya');

    useEffect(() => {
        Analytics.helpOpened(country);
    }, [country]);

    return (
        <div className="container fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--color-danger)' }}>
                <ShieldAlert size={32} />
                <h1 style={{ fontSize: '2rem', margin: 0 }}>Help Now</h1>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-danger)' }}>
                <h3 style={{ marginBottom: '10px' }}>First 10 Minutes Checklist</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <CheckSquare size={20} /> <span>Stop engaging (don't reply).</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <CheckSquare size={20} /> <span>Screenshot everything (URLs, profiles, messages).</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <CheckSquare size={20} /> <span>Mute or Block the abuser.</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <CheckSquare size={20} /> <span>Tell someone you trust.</span>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <label htmlFor="country-select" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select Country:</label>
                <select id="country-select" value={country} onChange={(e) => setCountry(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', width: '100%', maxWidth: '300px' }}>
                    {Object.keys(resources).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <h3 style={{ marginBottom: '10px' }}>Resources in {country}</h3>

            {resources[country].map((resource, index) => (
                <div key={index} className="card">
                    <h4 style={{ marginBottom: '8px' }}>{resource.name}</h4>
                    <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>{resource.description}</p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {resource.contacts.map((contact, idx) => {
                            let icon, href, label;
                            switch (contact.type) {
                                case 'phone':
                                    icon = <Phone size={16} />;
                                    href = `tel:${contact.value}`;
                                    label = `Call ${contact.value}`;
                                    break;
                                case 'whatsapp':
                                    icon = <MessageCircle size={16} />;
                                    href = `https://wa.me/${contact.value.replace(/[^0-9]/g, '')}`;
                                    label = 'WhatsApp';
                                    break;
                                case 'email':
                                    icon = <Mail size={16} />;
                                    href = `mailto:${contact.value}`;
                                    label = 'Email';
                                    break;
                                case 'website':
                                    icon = <Globe size={16} />;
                                    href = contact.value;
                                    label = 'Visit Website';
                                    break;
                            }
                            return (
                                <a key={idx} href={href} target={contact.type === 'website' ? '_blank' : undefined} rel={contact.type === 'website' ? 'noreferrer' : undefined} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => Analytics.helpResourceClicked(country, resource.name, contact.type)}>
                                    {icon} {label}
                                </a>
                            );
                        })}
                    </div>
                </div>
            ))}

            <button className="btn btn-outline btn-block" style={{ marginTop: 'auto' }} onClick={() => navigate('/')}>
                Back to Home
            </button>
        </div>
    );
};
