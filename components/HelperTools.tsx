
import React from 'react';
import Spinner from './Spinner';
import type { DescriptionResponse } from '../types';

interface HelperToolsProps {
    isLoadingTitles: boolean;
    titles: string[] | null;
    onSuggestTitles: () => void;
    isLoadingDescription: boolean;
    description: DescriptionResponse | null;
    onCreateDescription: () => void;
}

const HelperTools: React.FC<HelperToolsProps> = ({
    isLoadingTitles,
    titles,
    onSuggestTitles,
    isLoadingDescription,
    description,
    onCreateDescription
}) => {
    return (
        <div className="mt-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Herramientas Adicionales ✨</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Title Suggester */}
                <div className="bg-white p-6 rounded-2xl border-2 border-black flex flex-col">
                    <h3 className="font-bold text-lg mb-4">Sugeridor de Títulos</h3>
                    <div className="mt-4 text-sm flex-grow">
                        {isLoadingTitles && <div className="flex justify-center"><Spinner /></div>}
                        {titles && (
                            <ul className="list-disc list-inside space-y-1">
                                {titles.map((title, index) => <li key={index}>{title}</li>)}
                            </ul>
                        )}
                    </div>
                    <button
                        onClick={onSuggestTitles}
                        disabled={isLoadingTitles}
                        className="w-full bg-black text-white font-bold py-2 px-4 rounded-xl hover:bg-gray-800 transition-colors duration-200 mt-4 disabled:bg-gray-500"
                    >
                       {isLoadingTitles ? 'Pensando...' : '✨ Sugerir Títulos para YouTube'}
                    </button>
                </div>

                {/* Description Generator */}
                <div className="bg-white p-6 rounded-2xl border-2 border-black flex flex-col">
                    <h3 className="font-bold text-lg mb-4">Generador de Descripción</h3>
                    <div className="mt-4 text-sm whitespace-pre-wrap flex-grow">
                        {isLoadingDescription && <div className="flex justify-center"><Spinner /></div>}
                        {description && (
                            <div>
                                <p>{description.summary}</p>
                                <p className="mt-4 font-semibold">EN ESTE VIDEO:</p>
                                <ul className="list-disc list-inside">
                                    {description.key_points.map((point, index) => <li key={index}>{point}</li>)}
                                </ul>
                                <p className="mt-4 text-gray-600">{description.hashtags.join(' ')}</p>
                            </div>
                        )}
                    </div>
                     <button
                        onClick={onCreateDescription}
                        disabled={isLoadingDescription}
                        className="w-full bg-black text-white font-bold py-2 px-4 rounded-xl hover:bg-gray-800 transition-colors duration-200 mt-4 disabled:bg-gray-500"
                    >
                       {isLoadingDescription ? 'Creando...' : '✨ Crear Descripción del Video'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelperTools;
