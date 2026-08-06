import React from 'react';
import PropertyStructureBuilder from '@/Components/Admin/PropertyStructureBuilder';

export default function CondominiumSetup({ allCondominiums = [] }) {
    return (
        <PropertyStructureBuilder allCondominiums={allCondominiums} />
    );
}

