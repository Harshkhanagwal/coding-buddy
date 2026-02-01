import React, { useState, useEffect } from "react";
import "./style.css";
import Editor from "@monaco-editor/react";
import { VscRunAll } from "react-icons/vsc";
import axios from 'axios';
import PageLoader from "../pageLoader/PageLoader";

const Codeeditor = ({ setCode, code, explainCode, isLoading }) => {
    const [language, setLanguage] = useState("text");
    const [languages, setLanguages] = useState([]);
    const [selectedLangData, setSelectedLangData] = useState(null);
    const [pageLoader, setPageLoader] = useState(false);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const API = axios.create({
        baseURL: "https://emkc.org/api/v2/piston"
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            localStorage.setItem("savedCode", code);
        }, 100);
        return () => clearTimeout(timeoutId);
    }, [code]);

    useEffect(() => {
        const fetchLang = async () => {
            setPageLoader(true);
            try {
                const res = await API.get('/runtimes');
                const uniqueLangs = res.data.filter((value, index, self) =>
                    index === self.findIndex((t) => t.language === value.language)
                );
                setLanguages(uniqueLangs);
            } catch (error) {
                console.error(error);
            } finally {
                setPageLoader(false);
            }
        };
        fetchLang();
    }, []);

    const handleChange = (value) => {
        setCode(value);
    };

    const handleLanguageChange = (e) => {
        const val = e.target.value;
        if (val === "text") {
            setLanguage("text");
            setSelectedLangData(null);
        } else {
            const langObj = JSON.parse(val);
            setLanguage(langObj.language);
            setSelectedLangData(langObj);
        }
    };

    const runCode = async () => {
        if (!selectedLangData) return;
        try {
            const res = await API.post('/execute', {
                "language": selectedLangData.language,
                "version": selectedLangData.version,
                "files": [{ "content": code }],
                "stdin": input
            });
            setOutput(res.data.run.output || res.data.run.stderr || "Code executed.");
        } catch (error) {
            alert("Not able to Execute the Code");
            console.error(error);
        }
    };

    return (
        <>
            {pageLoader && <PageLoader />}
            <div className="editorbox">
                <div className="note">
                    <strong>Note</strong>: To brainstorm logic or explore frameworks without using the built-in compiler, simply select <b>"Take Help from AI"</b> from the language dropdown. In this mode, you can team up with your Coding Buddy to get guidance on any code snippet or language!
                </div>
                <div className="editor-toolbar">
                    <div className="language-selector">
                        <p className="selector-lable">Select Language</p>
                        <select 
                            value={selectedLangData ? JSON.stringify(selectedLangData) : "text"} 
                            onChange={handleLanguageChange}
                        >
                            <option value="text">Take Help with AI : Any Language</option>
                            {languages.length > 0 && languages.map((lang, index) => (
                                <option key={index} value={JSON.stringify(lang)}>
                                    {lang.language} ({lang.version})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="editor-toolbar-buttons">
                        <button 
                            disabled={language === "text"} 
                            className="runcode" 
                            onClick={runCode}
                        >
                            Run <VscRunAll />
                        </button>
                        <button
                            className="explain-btn"
                            onClick={explainCode}
                            disabled={isLoading}
                        >
                            {isLoading ? "Analyzing..." : "Explain"}
                        </button>
                    </div>
                </div>
                <Editor
                    height="70vh"
                    language={language === "text" ? "javascript" : language}
                    value={code}
                    onChange={handleChange}
                    theme="vs-light"
                />
            </div>
            <div className="exicution-area">
                <div className="input-area exicution-bx">
                    <h3>Input</h3>
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} name="input" placeholder="Enter your Input here"></textarea>
                </div>
                <div className="output-area exicution-bx">
                    <h3>Output</h3>
                    {output ? (
                        <pre className="output-txt-content">{output}</pre>
                    ) : (
                        <p className="output-txt">Run your code to see the output</p>
                    )} 
                </div>
            </div>
        </>
    );
};

export default Codeeditor;