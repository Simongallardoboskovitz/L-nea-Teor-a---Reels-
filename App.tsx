
import React, { useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import HelperTools from './components/HelperTools';
import { generateScript, suggestTitles, createDescription } from './services/geminiService';
import type { Scene, DescriptionResponse } from './types';

// Declare pdfjsLib as a global variable to inform TypeScript
declare const pdfjsLib: any;

const App: React.FC = () => {
    const [paperText, setPaperText] = useState<string>('');
    const [scriptStyle, setScriptStyle] = useState<string>('Estilo Stand-up (ingenioso y directo)');
    const [pdfStatus, setPdfStatus] = useState<string>('');
    const [scenes, setScenes] = useState<Scene[] | null>(null);
    const [titles, setTitles] = useState<string[] | null>(null);
    const [description, setDescription] = useState<DescriptionResponse | null>(null);

    const [isLoadingScript, setIsLoadingScript] = useState<boolean>(false);
    const [isLoadingTitles, setIsLoadingTitles] = useState<boolean>(false);
    const [isLoadingDescription, setIsLoadingDescription] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handlePdfUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || file.type !== 'application/pdf') {
            setPdfStatus('Por favor, selecciona un archivo PDF.');
            return;
        }

        setPdfStatus('📄 Extrayendo texto del PDF...');
        setPaperText('');

        try {
            const fileReader = new FileReader();
            fileReader.onload = async function() {
                const typedarray = new Uint8Array(this.result as ArrayBuffer);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map((item: any) => item.str).join(' ');
                    fullText += pageText + '\n\n';
                }
                setPaperText(fullText);
                setPdfStatus(`✅ Texto extraído de ${pdf.numPages} páginas.`);
            };
            fileReader.readAsArrayBuffer(file);
        } catch (err) {
            console.error('Error parsing PDF:', err);
            setPdfStatus('❌ Error al leer el PDF.');
            setPaperText('');
        }
    };

    const validateInput = useCallback(() => {
        if (paperText.trim() === '') {
            alert('Por favor, sube un PDF o pega texto antes de generar contenido.');
            return false;
        }
        return true;
    }, [paperText]);

    const handleGenerateScript = useCallback(async () => {
        if (!validateInput()) return;

        setIsLoadingScript(true);
        setError(null);
        setScenes(null);
        setTitles(null);
        setDescription(null);

        try {
            const result = await generateScript(paperText, scriptStyle);
            setScenes(result);
        } catch (err) {
            console.error(err);
            setError('No se pudo generar el guion. Por favor, intenta de nuevo.');
        } finally {
            setIsLoadingScript(false);
        }
    }, [paperText, scriptStyle, validateInput]);

    const handleSuggestTitles = useCallback(async () => {
        if (!validateInput()) return;

        setIsLoadingTitles(true);
        setTitles(null);
        try {
            const result = await suggestTitles(paperText);
            setTitles(result);
        } catch (err) {
            console.error(err);
            // Don't show a generic error, just let the result area be empty
        } finally {
            setIsLoadingTitles(false);
        }
    }, [paperText, validateInput]);

    const handleCreateDescription = useCallback(async () => {
        if (!validateInput()) return;

        setIsLoadingDescription(true);
        setDescription(null);
        try {
            const result = await createDescription(paperText);
            setDescription(result);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingDescription(false);
        }
    }, [paperText, validateInput]);


    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-7xl">
            <Header />
            <InputSection
                paperText={paperText}
                setPaperText={setPaperText}
                scriptStyle={scriptStyle}
                setScriptStyle={setScriptStyle}
                pdfStatus={pdfStatus}
                handlePdfUpload={handlePdfUpload}
                handleGenerateScript={handleGenerateScript}
                isLoading={isLoadingScript}
            />
            <OutputSection
                isLoading={isLoadingScript}
                error={error}
                scenes={scenes}
            />
            {scenes && (
                <HelperTools
                    isLoadingTitles={isLoadingTitles}
                    titles={titles}
                    onSuggestTitles={handleSuggestTitles}
                    isLoadingDescription={isLoadingDescription}
                    description={description}
                    onCreateDescription={handleCreateDescription}
                />
            )}
        </div>
    );
};

export default App;
