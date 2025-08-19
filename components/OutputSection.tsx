
import React from 'react';
import type { Scene } from '../types';
import Spinner from './Spinner';

interface OutputSectionProps {
    isLoading: boolean;
    error: string | null;
    scenes: Scene[] | null;
}

const OutputSection: React.FC<OutputSectionProps> = ({ isLoading, error, scenes }) => {
    if (isLoading) {
        return (
            <div className="mt-8 flex flex-col items-center justify-center text-center p-8">
                <Spinner />
                <p className="mt-4 font-medium">Analizando el texto y construyendo tu guion...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-8 border-2 border-black text-black px-4 py-3 rounded-xl" role="alert">
                <strong className="font-bold">¡Error!</strong>
                <span className="block sm:inline ml-2">{error}</span>
            </div>
        );
    }

    if (!scenes) {
        return null; // Don't render anything if there's no data and no loading/error
    }

    return (
        <div className="mt-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Propuesta de Guion</h2>
            <div className="overflow-x-auto bg-white rounded-2xl border-2 border-black">
                <table className="min-w-full">
                    <thead className="border-b-2 border-black">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-1/12">Nº Escena</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-4/12">Guion Propuesto</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-4/12">Indicaciones Visuales / Técnicas</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-3/12">Guía Creativa</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                        {scenes.map((scene, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{scene.sceneNumber || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-pre-wrap text-sm">{scene.script || ''}</td>
                                <td className="px-6 py-4 whitespace-pre-wrap text-sm">{scene.visuals || ''}</td>
                                <td className="px-6 py-4 whitespace-pre-wrap text-sm font-medium italic">{scene.guide || ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OutputSection;
