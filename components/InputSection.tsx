
import React from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

interface InputSectionProps {
    paperText: string;
    setPaperText: Dispatch<SetStateAction<string>>;
    scriptStyle: string;
    setScriptStyle: Dispatch<SetStateAction<string>>;
    pdfStatus: string;
    handlePdfUpload: (event: ChangeEvent<HTMLInputElement>) => void;
    handleGenerateScript: () => void;
    isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
    paperText,
    setPaperText,
    scriptStyle,
    setScriptStyle,
    pdfStatus,
    handlePdfUpload,
    handleGenerateScript,
    isLoading
}) => {
    return (
        <div className="bg-white p-6 rounded-2xl border-2 border-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Inputs */}
                <div>
                    <div className="mb-6">
                        <label htmlFor="pdf-upload" className="block text-sm font-bold text-black mb-2">1. Sube tu documento escrito en PDF:</label>
                        <input
                            type="file"
                            id="pdf-upload"
                            accept="application/pdf"
                            onChange={handlePdfUpload}
                            disabled={isLoading}
                            className="w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-black file:font-semibold file:bg-white file:text-black hover:file:bg-gray-100 disabled:opacity-50"
                        />
                        <p className="text-xs mt-2 h-4">{pdfStatus}</p>
                    </div>
                    <div>
                        <label htmlFor="paper-text" className="block text-sm font-bold text-black mb-2">O pega el texto aquí:</label>
                        <textarea
                            id="paper-text"
                            rows={12}
                            value={paperText}
                            onChange={(e) => setPaperText(e.target.value)}
                            disabled={isLoading}
                            className="w-full p-4 border-2 border-black rounded-xl focus:ring-2 focus:ring-black focus:border-black transition duration-150 disabled:opacity-50"
                            placeholder="El texto de tu PDF aparecerá aquí, o puedes pegarlo manualmente..."
                        />
                    </div>
                </div>

                {/* Right Column: Controls */}
                <div className="flex flex-col justify-between">
                    <div>
                        <label htmlFor="script-style" className="block text-sm font-bold text-black mb-2">2. Elige el tono del guion:</label>
                        <select
                            id="script-style"
                            value={scriptStyle}
                            onChange={(e) => setScriptStyle(e.target.value)}
                            disabled={isLoading}
                            className="w-full p-3 border-2 border-black rounded-xl focus:ring-2 focus:ring-black focus:border-black transition duration-150 bg-white disabled:opacity-50"
                        >
                            <option value="Estilo Stand-up (ingenioso y directo)">Estilo Stand-up (Ingenioso y Directo)</option>
                            <option value="Estilo Documental (informativo y preciso)">Estilo Documental (Informativo y Preciso)</option>
                            <option value="Estilo Crítico (analítico y reflexivo)">Estilo Crítico (Analítico y Reflexivo)</option>
                            <option value="Estilo Educativo (claro y equilibrado)">Estilo Educativo (Claro y Equilibrado)</option>
                        </select>
                    </div>
                    <div>
                        <button
                            id="generate-button"
                            onClick={handleGenerateScript}
                            disabled={isLoading}
                            className="w-full bg-black text-white font-bold py-3 px-4 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-transform transform hover:scale-105 duration-200 mt-4 disabled:bg-gray-500 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? 'Generando...' : '3. Generar Guion'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InputSection;
